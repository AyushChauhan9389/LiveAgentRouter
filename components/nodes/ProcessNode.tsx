import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function ProcessNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-48">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-amber-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-amber-100 border-b-4 border-r-4 border-amber-800 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-amber-200 group">
        <NodeMenu id={id} color="text-amber-900" />
        <div className="bg-amber-50 p-3 border border-amber-200/50 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            </div>
            <div className="text-[8px] font-mono text-amber-800/50">
              ID: {Math.floor(Math.random() * 1000)}
            </div>
          </div>

          <div className="font-mono text-sm text-amber-900 font-bold text-center uppercase tracking-tight">
            {data.label as string}
          </div>

          <div className="mt-3 h-1 w-full bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 w-[60%] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-amber-600 !border-amber-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-amber-600 !border-amber-100 !rounded-sm"
      />
    </div>
  );
}
