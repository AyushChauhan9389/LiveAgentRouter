import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function StartNode({ id, data }: NodeProps) {
  return (
    <div className="relative w-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-lime-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-lime-100 border-b-4 border-r-4 border-lime-800 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-lime-200 group">
         <NodeMenu id={id} color="text-lime-900" />
         <div className="bg-lime-50 p-3 border border-lime-200/50 rounded">
            <div className="flex justify-center items-center mb-1">
               <div className="w-3 h-3 rounded-full bg-lime-500 animate-pulse shadow-[0_0_10px_rgba(132,204,22,0.6)]"></div>
            </div>
            
            <div className="font-mono text-sm text-lime-900 font-bold text-center uppercase tracking-tight">
              {data.label as string}
            </div>
            
             <div className="mt-2 h-1 w-full bg-lime-200 rounded-full overflow-hidden">
               <div className="h-full bg-lime-500 w-full relative overflow-hidden">
               </div>
            </div>
         </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-lime-600 !border-lime-100 !rounded-sm"
      />
    </div>
  );
}