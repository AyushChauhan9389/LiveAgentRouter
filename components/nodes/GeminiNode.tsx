import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function GeminiNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-64">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-blue-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-blue-100 border-b-4 border-r-4 border-blue-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-blue-200 group">
         <NodeMenu id={id} />
         <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 border border-blue-200/50 rounded">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 2C11 8 8 11 2 12C8 13 11 16 12 22C13 16 16 13 22 12C16 11 13 8 12 2Z" className="text-blue-600"/>
                   </svg>
                   <div className="text-[8px] font-mono font-bold text-blue-800 uppercase">Gemini</div>
                </div>
               <div className="flex space-x-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-75"></div>
               </div>
            </div>
            
            <div className="font-mono text-sm text-blue-900 font-bold text-center uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-purple-800 mb-2">
              {data.label as string}
            </div>
            
            <div className="mb-3">
               <label htmlFor="gemini-model-select" className="sr-only">Select Model</label>
               <select 
                 id="gemini-model-select"
                 className="nodrag w-full bg-white/50 border border-blue-300 text-blue-900 text-[10px] rounded px-1 py-1 font-mono focus:outline-none focus:border-blue-500"
                 defaultValue="gemini-1.5-pro"
               >
                 <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                 <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                 <option value="gemini-pro">gemini-pro</option>
               </select>
            </div>
            
            <div className="mt-1 h-1 w-full bg-blue-200 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
               </div>
            </div>
         </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-600 !border-blue-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-600 !border-blue-100 !rounded-sm"
      />
    </div>
  );
}
