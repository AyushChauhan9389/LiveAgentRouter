'use client';

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import { CustomNode } from '../nodes/CustomNode';
import { OpenAINode } from '../nodes/OpenAINode';
import { GeminiNode } from '../nodes/GeminiNode';
import { HuggingFaceNode } from '../nodes/HuggingFaceNode';
import { StartNode } from '../nodes/StartNode';
import { ProcessNode } from '../nodes/ProcessNode';
import { EndNode } from '../nodes/EndNode';
import { RouterNode } from '../nodes/RouterNode';
import { LiveAgentNode } from '../nodes/LiveAgentNode';

// Register custom node types
const nodeTypes = {
  custom: CustomNode,
  openai: OpenAINode,
  gemini: GeminiNode,
  huggingface: HuggingFaceNode,
  start: StartNode,
  process: ProcessNode,
  end: EndNode,
  router: RouterNode,
  liveAgent: LiveAgentNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Initiate' },
    position: { x: 250, y: 50 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: label, description: 'A new draggable component' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="h-screen w-full relative bg-white overflow-hidden">
      <Sidebar />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
