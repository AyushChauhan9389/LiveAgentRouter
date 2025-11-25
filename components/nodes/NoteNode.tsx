import { type NodeProps, NodeResizer } from '@xyflow/react';
import React, { useState, useCallback } from 'react';
import { NodeMenu } from './NodeMenu';

export function NoteNode({ id, data, selected }: NodeProps) {
  const [text, setText] = useState((data.label as string) || 'Double click to edit...');
  const [isEditing, setIsEditing] = useState(false);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(evt.target.value);
    data.label = evt.target.value; // Update internal data for JSON export
  }, [data]);

  return (
    <div className="relative min-w-[160px] min-h-[80px] h-full group">
      {/* Resizer visible when selected */}
      <NodeResizer 
        minWidth={160} 
        minHeight={80} 
        isVisible={selected} 
        lineClassName="border-yellow-400" 
        handleClassName="h-2 w-2 bg-yellow-400 border border-yellow-600 rounded" 
      />
       
      <div className={`h-full w-full bg-yellow-100/90 border ${selected ? 'border-yellow-500 shadow-lg' : 'border-yellow-300 shadow-sm'} rounded-lg p-0 flex flex-col transition-all hover:shadow-md backdrop-blur-sm`}>
         {/* Header / Drag Handle */}
         <div className="h-6 bg-yellow-200/50 border-b border-yellow-300/50 rounded-t-lg flex items-center px-2 justify-between">
            <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-700">
                    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                </svg>
                <span className="text-[9px] font-bold text-yellow-800 uppercase tracking-wider">Note</span>
            </div>
            <NodeMenu id={id} />
         </div>

         {/* Content Area */}
         <div className="flex-1 p-2 cursor-text">
            {isEditing ? (
                <textarea
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-stone-800 text-xs leading-relaxed font-medium"
                    value={text}
                    onChange={onChange}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    placeholder="Type something..."
                />
            ) : (
                <div 
                    className="w-full h-full text-stone-800 text-xs leading-relaxed font-medium whitespace-pre-wrap"
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {text}
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
