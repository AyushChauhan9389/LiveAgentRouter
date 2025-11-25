"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import JsonButton from "./JsonButton";
import { CustomNode } from "../nodes/CustomNode";
import { OpenAINode } from "../nodes/OpenAINode";
import { GeminiNode } from "../nodes/GeminiNode";
import { HuggingFaceNode } from "../nodes/HuggingFaceNode";
import { StartNode } from "../nodes/StartNode";
import { ProcessNode } from "../nodes/ProcessNode";
import { EndNode } from "../nodes/EndNode";
import { RouterNode } from "../nodes/RouterNode";
import { LiveAgentNode } from "../nodes/LiveAgentNode";
import { DeviceNode } from "../nodes/DeviceNode";
import { GlobalConnectorNode } from "../nodes/GlobalConnectorNode";
import { ClaudeNode } from "../nodes/ClaudeNode";
import { NoteNode } from "../nodes/NoteNode";
import { createClient } from "@/utils/supabase/client";

// Register custom node types
const nodeTypes = {
  custom: CustomNode,
  openai: OpenAINode,
  gemini: GeminiNode,
  huggingface: HuggingFaceNode,
  claude: ClaudeNode,
  note: NoteNode,
  start: StartNode,
  process: ProcessNode,
  end: EndNode,
  router: RouterNode,
  liveAgent: LiveAgentNode,
  device: DeviceNode,
  globalConnector: GlobalConnectorNode,
};

const getId = () => `node_${crypto.randomUUID()}`;

interface FlowProps {
  initialDevices: any[];
}

function Flow({ initialDevices }: FlowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isInitialized, setIsInitialized] = useState(false);

  const getDefaultNodes = useCallback(() => [
    {
      id: "1",
      type: "start",
      data: { label: "Initiate" },
      position: { x: 250, y: 50 },
    },
    ...initialDevices.map((device, index) => ({
      id: `device-${device.id}`,
      type: "device",
      position: { x: 100 + index * 250, y: 500 },
      data: {
        label: device.device_name,
        ...device,
      },
    })),
  ], [initialDevices]);

  const [nodes, setNodes, onNodesChange] = useNodesState(getDefaultNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, setViewport } = useReactFlow();

  // Load from local storage on mount
  useEffect(() => {
    const savedFlow = localStorage.getItem('flow-storage');
    if (savedFlow) {
      try {
        const flow = JSON.parse(savedFlow);
        if (flow.nodes) setNodes(flow.nodes);
        if (flow.edges) setEdges(flow.edges);
        if (flow.viewport) setViewport(flow.viewport);
      } catch (e) {
        console.error("Failed to load flow from local storage", e);
      }
    }
    setIsInitialized(true);
  }, [setNodes, setEdges, setViewport]);

  // Auto-save to local storage
  useEffect(() => {
    if (!isInitialized) return;

    setSaveStatus('saving');
    const handler = setTimeout(() => {
      const flowData = { nodes, edges };
      localStorage.setItem('flow-storage', JSON.stringify(flowData));
      setSaveStatus('saved');
    }, 1000); // 1 second debounce

    return () => clearTimeout(handler);
  }, [nodes, edges, isInitialized]);

  const onReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the flow? This will clear all changes and revert to the default state.')) {
        setNodes(getDefaultNodes());
        setEdges([]);
        localStorage.removeItem('flow-storage');
        setSaveStatus('saved');
    }
  }, [getDefaultNodes, setNodes, setEdges]);

  const usedDeviceIds = nodes
    .filter((node) => node.type === "device")
    .map((node) => {
      return node.id.startsWith("device-")
        ? node.id.replace("device-", "")
        : String(node.data.id || "");
    });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime devices")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "devices",
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === `device-${payload.new.id}`) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    ...payload.new,
                    label: payload.new.device_name,
                  },
                };
              }
              return node;
            }),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const label = event.dataTransfer.getData("application/reactflow/label");
      const metaString = event.dataTransfer.getData(
        "application/reactflow/meta",
      );
      const meta = metaString ? JSON.parse(metaString) : {};

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        // If it's a DB device, use its DB ID to allow realtime updates
        id: meta.db_id ? `device-${meta.db_id}` : getId(),
        type,
        position,
        data: {
          label: label,
          description: "A new draggable component",
          ...meta,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="h-screen w-full relative bg-white overflow-hidden">
      <Sidebar devices={initialDevices} usedDeviceIds={usedDeviceIds} />
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
          {/* Status Indicator */}
          <div className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-colors border ${
              saveStatus === 'saving' 
                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
              {saveStatus === 'saving' ? (
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                      <span>Saving...</span>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <span>Saved</span>
                  </div>
              )}
          </div>

          {/* Reset Button */}
          <button 
              onClick={onReset}
              className="px-3 py-2 bg-white border border-stone-200 shadow-sm rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all active:scale-95 flex items-center gap-2 group text-stone-600"
              title="Reset Flow"
          >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-xs font-bold uppercase">Reset</span>
          </button>

          <JsonButton />
      </div>

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
          defaultEdgeOptions={{ animated: true }}
          fitView
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function FlowBuilder({
  initialDevices,
}: {
  initialDevices: any[];
}) {
  return (
    <ReactFlowProvider>
      <Flow initialDevices={initialDevices} />
    </ReactFlowProvider>
  );
}
