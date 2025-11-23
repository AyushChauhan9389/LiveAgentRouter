import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function HuggingFaceNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-64">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-yellow-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-yellow-100 border-b-4 border-r-4 border-yellow-600 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-yellow-200 group">
        <NodeMenu id={id} />
        <div className="bg-yellow-50 p-3 border border-yellow-200/50 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <span className="text-lg">🤗</span>
              <div className="text-[8px] font-mono font-bold text-yellow-800 uppercase">
                Hugging Face
              </div>
            </div>
            <div className="w-2 h-2 rounded-sm bg-yellow-500 animate-pulse"></div>
          </div>

          <div className="font-mono text-sm text-yellow-900 font-bold text-center uppercase tracking-tight mb-2">
            {data.label as string}
          </div>

          <div className="mb-3">
            <label htmlFor="hf-model-input" className="sr-only">
              Model ID
            </label>
            <input
              id="hf-model-input"
              type="text"
              placeholder="meta-llama/Llama-3-8b"
              className="nodrag w-full bg-white border border-yellow-300 text-yellow-900 text-[10px] rounded px-2 py-1 font-mono focus:outline-none focus:border-yellow-500 placeholder:text-yellow-400/70"
            />
          </div>

          <div className="mt-1 h-1 w-full bg-yellow-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 w-[60%] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-yellow-500 !border-yellow-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-yellow-500 !border-yellow-100 !rounded-sm"
      />
    </div>
  );
}
