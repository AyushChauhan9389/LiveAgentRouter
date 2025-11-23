import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function LiveAgentNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-64">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-rose-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-rose-100 border-b-4 border-r-4 border-rose-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-rose-200 group">
         <NodeMenu id={id} />
         <div className="bg-rose-50 p-3 border border-rose-200/50 rounded">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-rose-200">
                      {/* Microphone Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-rose-700 z-10">
                        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                        <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                      </svg>
                      {/* Pulsing Rings */}
                      <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                  </div>
                  <div className="text-[8px] font-mono font-bold text-rose-800 uppercase">LIVE AGENT</div>
               </div>
               
               {/* Equalizer Animation */}
               <div className="flex items-end gap-0.5 h-4">
                 <div className="w-1 bg-rose-500 rounded-t animate-[bounce_1s_infinite] h-[60%]"></div>
                 <div className="w-1 bg-rose-500 rounded-t animate-[bounce_1.2s_infinite] h-[80%]"></div>
                 <div className="w-1 bg-rose-500 rounded-t animate-[bounce_0.8s_infinite] h-[40%]"></div>
                 <div className="w-1 bg-rose-500 rounded-t animate-[bounce_1.1s_infinite] h-[100%]"></div>
               </div>
            </div>
            
            <div className="font-mono text-sm text-rose-900 font-bold text-center uppercase tracking-tight mb-1">
              {data.label as string}
            </div>
             <div className="text-[9px] text-rose-600/70 text-center font-mono uppercase tracking-widest mb-2">
                Listening...
            </div>
            
            <div className="mt-2 h-1 w-full bg-rose-200 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-rose-500 to-fuchsia-500 w-[90%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
               </div>
            </div>
         </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-rose-600 !border-rose-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-rose-600 !border-rose-100 !rounded-sm"
      />
    </div>
  );
}
