import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function GlobalConnectorNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-48">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-purple-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-purple-100 border-b-4 border-r-4 border-purple-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-purple-200 group">
        <NodeMenu id={id} color="text-purple-900" />
        <div className="bg-purple-50 p-3 border border-purple-200/50 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-purple-700"
              >
                <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
              </svg>
              <div className="text-[8px] font-mono font-bold text-purple-800 uppercase">
                CONNECTOR
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          </div>

          <div className="font-mono text-sm text-purple-900 font-bold text-center uppercase tracking-tight mb-3">
            {data.label as string}
          </div>

          <div className="flex flex-col gap-1 bg-purple-200/30 p-2 rounded border border-purple-300/30">
            <div className="text-[9px] font-mono font-bold text-purple-800 text-center">
              MULTI-INPUT
            </div>
            <div className="h-px w-full bg-purple-300"></div>
            <div className="text-[9px] font-mono font-bold text-purple-800 text-center">
              MULTI-OUTPUT
            </div>
          </div>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-6 !rounded-sm !bg-purple-600 !border-purple-100"
        style={{ top: "50%" }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-6 !rounded-sm !bg-purple-600 !border-purple-100"
        style={{ top: "50%" }}
      />
    </div>
  );
}
