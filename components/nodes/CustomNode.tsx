import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function CustomNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-48">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-stone-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-stone-100 border-b-4 border-r-4 border-stone-800 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-stone-200 group">
         <NodeMenu id={id} color="text-stone-800" />
         <div className="bg-stone-50 p-3 border border-stone-200/50 rounded">
            <div className="flex justify-between items-center mb-2">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                 <div className="w-2 h-2 rounded-full bg-stone-400"></div>
               </div>
               <div className="text-[8px] font-mono text-stone-800/50">CUSTOM</div>
            </div>
            
            <div className="font-mono text-sm text-stone-900 font-bold text-center uppercase tracking-tight">
              {data.label as string}
            </div>
            <div className="text-[10px] text-stone-500 text-center mt-1 font-mono">
              {data.description as string}
            </div>
            
            <div className="mt-3 h-1 w-full bg-stone-200 rounded-full overflow-hidden">
               <div className="h-full bg-stone-600 w-[40%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
               </div>
            </div>
         </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-stone-600 !border-stone-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-stone-600 !border-stone-100 !rounded-sm"
      />
    </div>
  );
}