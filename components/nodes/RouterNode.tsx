import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function RouterNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-48">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-indigo-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-indigo-100 border-b-4 border-r-4 border-indigo-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-indigo-200 group">
        <NodeMenu id={id} color="text-indigo-900" />
        <div className="bg-indigo-50 p-3 border border-indigo-200/50 rounded flex items-center justify-center min-h-[80px]">
          <div className="font-mono text-sm text-indigo-900 font-bold text-center uppercase tracking-tight">
            Router Algorithm
          </div>
        </div>
      </div>

      {/* Input Handle - Left */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-left"
        className="w-3 h-3 !rounded-sm !bg-indigo-600 !border-indigo-100"
      />

      {/* Input Handle - Top */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-top"
        className="w-3 h-3 !rounded-sm !bg-indigo-600 !border-indigo-100"
      />

      {/* Output Handle - Right */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-indigo-600 !border-indigo-100 !rounded-sm"
      />
    </div>
  );
}
