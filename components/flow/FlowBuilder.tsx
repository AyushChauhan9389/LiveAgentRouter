"use client";

import React, { useCallback, useRef } from "react";
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
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

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
  device: DeviceNode,
  globalConnector: GlobalConnectorNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

interface FlowProps {
  initialDevices: any[];
}

function Flow({ initialDevices }: FlowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const defaultNodes: Node[] = [
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
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

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
      <JsonButton />
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
