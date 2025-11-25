import { Handle, Position, type NodeProps } from "@xyflow/react";
import React from "react";
import { NodeMenu } from "./NodeMenu";

export function ClaudeNode({ id, data }: NodeProps) {
  const [model, setModel] = React.useState((data.model as string) || 'claude-sonnet-4.5');

  const onChange = React.useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(evt.target.value);
    data.model = evt.target.value;
  }, [data]);

  return (
    <div className="relative w-64">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-orange-50 pattern-grid-lg opacity-20"></div>

      <div className="relative bg-orange-100 border-b-4 border-r-4 border-orange-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-orange-200 group">
        <NodeMenu id={id} />
        <div className="bg-orange-50 p-3 border border-orange-200/50 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-orange-700"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
              <div className="text-[8px] font-mono font-bold text-orange-800 uppercase">
                CLAUDE
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          </div>

          <div className="font-mono text-sm text-orange-900 font-bold text-center uppercase tracking-tight mb-2">
            {data.label as string}
          </div>

          <div className="mb-3">
            <label htmlFor="claude-model-select" className="sr-only">
              Select Model
            </label>
            <select
              id="claude-model-select"
              value={model}
              onChange={onChange}
              className="nodrag w-full bg-white/50 border border-orange-300 text-orange-900 text-[10px] rounded px-1 py-1 font-mono focus:outline-none focus:border-orange-500"
            >
              <option value="claude-sonnet-4.5">claude-sonnet-4.5</option>
              <option value="claude-opus-4.1">claude-opus-4.1</option>
            </select>
          </div>

          <div className="mt-1 h-1 w-full bg-orange-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 w-[85%] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-600 !border-orange-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-orange-600 !border-orange-100 !rounded-sm"
      />
    </div>
  );
}
