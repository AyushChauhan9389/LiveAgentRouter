import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function EndNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-red-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-red-100 border-b-4 border-r-4 border-red-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-red-200 group">
        <NodeMenu id={id} color="text-red-900" />
        <div className="bg-red-50 p-3 border border-red-200/50 rounded">
          <div className="flex justify-center items-center mb-1">
            <div className="w-3 h-3 rounded-sm bg-red-600"></div>
          </div>

          <div className="font-mono text-sm text-red-900 font-bold text-center uppercase tracking-tight">
            {data.label as string}
          </div>

          <div className="mt-2 h-1 w-full bg-red-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-red-600 !border-red-100 !rounded-sm"
      />
    </div>
  );
}
