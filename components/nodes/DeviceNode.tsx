import { Handle, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import { NodeMenu } from './NodeMenu';

export function DeviceNode({ id, data }: NodeProps) {
  const type = data.device_type as string;
  const isOn = data.is_on as boolean;
  
  // Icons
  const getIcon = () => {
    if (type === 'fan') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isOn ? 'animate-spin' : ''}`}>
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
        </svg>
      );
    } else if (type === 'light') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isOn ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-cyan-700'}`}>
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
        </svg>
      );
    } else if (type === 'AC') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9.725 9.725 0 0 0 4.1 9.911a.75.75 0 0 0 .71.346 8.262 8.262 0 0 1 2.287-.495 7.68 7.68 0 0 1 4.566 4.566 8.262 8.262 0 0 1 .495 2.287.75.75 0 0 0 .346.71 9.725 9.725 0 0 0 3.38 1.404.75.75 0 0 0 .082-1.152 7.547 7.547 0 0 1 1.715-1.705 9.742 9.742 0 0 0 6.177-3.539.75.75 0 0 0-.136-1.072 9.753 9.753 0 0 0-2.262-1.566 9.753 9.753 0 0 0-1.566-2.263 9.753 9.753 0 0 0-2.263-1.566 9.753 9.753 0 0 0-1.566-2.262 9.752 9.752 0 0 0-2.262-1.566Z" clipRule="evenodd" />
        </svg>
      );
    }
    return <div className="w-5 h-5 rounded bg-cyan-500" />;
  };

  return (
    <div className="relative w-56">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-cyan-50 pattern-grid-lg opacity-20"></div>
      
      <div className={`relative bg-cyan-50 border-b-4 border-r-4 rounded-lg p-1 transform transition-transform hover:-translate-y-1 hover:shadow-xl border-t border-l group ${isOn ? 'border-cyan-600 border-l-cyan-200 border-t-cyan-200' : 'border-stone-400 border-l-stone-200 border-t-stone-200'}`}>
         <NodeMenu id={id} color="text-cyan-900" />
         <div className={`p-3 border rounded transition-colors ${isOn ? 'bg-cyan-100 border-cyan-300' : 'bg-stone-100 border-stone-200'}`}>
            <div className="flex justify-between items-center mb-3">
               <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${isOn ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-stone-300 text-stone-500'}`}>
                     {getIcon()}
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold text-cyan-900 uppercase leading-none">{type}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${isOn ? 'text-green-600' : 'text-stone-500'}`}>
                        {isOn ? 'ONLINE' : 'OFFLINE'}
                      </span>
                  </div>
               </div>
               
               {/* Toggle Indicator */}
               <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></div>
            </div>
            
            <div className="font-mono text-sm text-cyan-950 font-bold text-center uppercase tracking-tight mb-3 truncate px-1">
              {(data.label || data.device_name) as string}
            </div>

            {/* Device Specific Attributes */}
            <div className="bg-white/50 rounded p-2 border border-cyan-200/50 backdrop-blur-sm">
                {type === 'fan' && (
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-cyan-800">SPEED</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(l => (
                                <div key={l} className={`w-1.5 h-3 rounded-sm ${l <= (data.fan_speed as number || 0) ? 'bg-cyan-500' : 'bg-cyan-200'}`}></div>
                            ))}
                        </div>
                    </div>
                )}

                {type === 'AC' && (
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-cyan-800">TEMP</span>
                        <span className="text-sm font-black text-cyan-600">{data.temperature || '--'}°C</span>
                    </div>
                )}
                
                {type === 'light' && (
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-cyan-800">BRIGHTNESS</span>
                        <span className="text-xs font-bold text-cyan-600">{isOn ? '100%' : '0%'}</span>
                    </div>
                )}
            </div>
         </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-cyan-600 !border-cyan-100 !rounded-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-cyan-600 !border-cyan-100 !rounded-sm"
      />
    </div>
  );
}
