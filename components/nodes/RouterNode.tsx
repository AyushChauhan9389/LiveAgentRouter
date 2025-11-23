import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function RouterNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-48">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-indigo-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-indigo-100 border-b-4 border-r-4 border-indigo-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-indigo-200 group">
         <NodeMenu id={id} color="text-indigo-900" />
         <div className="bg-indigo-50 p-3 border border-indigo-200/50 rounded">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-700">
                    <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
                  </svg>
                 <div className="text-[8px] font-mono font-bold text-indigo-800 uppercase">ROUTER</div>
               </div>
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
            </div>
            
            <div className="font-mono text-sm text-indigo-900 font-bold text-center uppercase tracking-tight mb-3">
              {data.label as string}
            </div>

            {/* Outputs Visualization */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-indigo-200/50 px-2 py-1 rounded border border-indigo-300/50">
                    <span className="text-[9px] font-mono font-bold text-indigo-800">Route A</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                </div>
                <div className="flex items-center justify-between bg-indigo-200/50 px-2 py-1 rounded border border-indigo-300/50">
                    <span className="text-[9px] font-mono font-bold text-indigo-800">Route B</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                </div>
                <div className="flex items-center justify-between bg-indigo-200/50 px-2 py-1 rounded border border-indigo-300/50">
                    <span className="text-[9px] font-mono font-bold text-indigo-800">Route C</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                </div>
            </div>
         </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-6 !rounded-sm !bg-indigo-600 !border-indigo-100"
        style={{ top: '50%' }}
      />

      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="w-2 h-2 !bg-indigo-600 !border-indigo-100 !rounded-full"
        style={{ top: '55%' }} 
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="w-2 h-2 !bg-indigo-600 !border-indigo-100 !rounded-full"
        style={{ top: '70%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c"
        className="w-2 h-2 !bg-indigo-600 !border-indigo-100 !rounded-full"
        style={{ top: '85%' }}
      />
    </div>
  );
}
