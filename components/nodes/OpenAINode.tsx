import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function OpenAINode({ id, data }: NodeProps) {
  return (
    <div className="relative w-64">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-teal-50 pattern-grid-lg opacity-20"></div>
      
      <div className="relative bg-teal-100 border-b-4 border-r-4 border-teal-900 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l border-teal-200 group">
         <NodeMenu id={id} />
         <div className="bg-teal-50 p-3 border border-teal-200/50 rounded">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal-700">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1195 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.453l-.142.0805L8.704 5.4596a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l3.1028-1.7963 3.1028 1.7963v3.5873l-3.1028 1.7915-3.1028-1.7915z" />
                  </svg>
                  <div className="text-[8px] font-mono font-bold text-teal-800 uppercase">OPENAI</div>
               </div>
               <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            </div>
            
            <div className="font-mono text-sm text-teal-900 font-bold text-center uppercase tracking-tight mb-2">
              {data.label as string}
            </div>
            
            <div className="mb-3">
               <label htmlFor="model-select" className="sr-only">Select Model</label>
               <select 
                 id="model-select"
                 className="nodrag w-full bg-white/50 border border-teal-300 text-teal-900 text-[10px] rounded px-1 py-1 font-mono focus:outline-none focus:border-teal-500"
                 defaultValue="gpt-4o"
               >
                 <option value="gpt-4o">gpt-4o</option>
                 <option value="gpt-4-turbo">gpt-4-turbo</option>
                 <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
               </select>
            </div>

            <div className="mt-1 h-1 w-full bg-teal-200 rounded-full overflow-hidden">
               <div className="h-full bg-teal-600 w-[85%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
               </div>
            </div>
         </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-teal-600 !border-teal-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-teal-600 !border-teal-100 !rounded-sm"
      />
    </div>
  );
}
