'use client';

import { useReactFlow, type Node, type Edge } from '@xyflow/react';
import React, { useState, useEffect } from 'react';

interface JsonViewProps {
  isOpen: boolean;
  onClose: () => void;
}

function JsonViewSidebar({ isOpen, onClose }: JsonViewProps) {
  const { getNodes, getEdges } = useReactFlow();
  const [jsonOutput, setJsonOutput] = useState<string>('');

  // Update JSON whenever the sidebar is opened
  useEffect(() => {
    if (isOpen) {
      const nodes = getNodes();
      const edges = getEdges();

      const flowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
        })),
        edges: edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle
        })),
      };

      setJsonOutput(JSON.stringify(flowData, null, 2));
    }
  }, [isOpen, getNodes, getEdges]);

  return (
    <div
      className={`absolute top-0 right-0 h-full w-96 bg-white border-l border-stone-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col font-mono ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
        <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Flow JSON</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-stone-50/50">
        <pre className="text-[10px] text-stone-700 whitespace-pre-wrap break-all">
          {jsonOutput}
        </pre>
      </div>
      
      <div className="p-4 border-t border-stone-200 bg-white">
         <button 
            onClick={() => {
                 navigator.clipboard.writeText(jsonOutput);
                 alert('JSON copied to clipboard!');
            }}
            className="w-full py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
            </svg>
            Copy to Clipboard
         </button>
      </div>
    </div>
  );
}

export default function JsonButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 right-4 z-40 px-3 py-2 bg-white border border-stone-200 shadow-lg rounded-lg hover:bg-stone-50 transition-all active:scale-95 flex items-center gap-2 group"
            >
                <span className="font-mono text-xs font-bold text-stone-600 group-hover:text-stone-900 uppercase">JSON</span>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400 group-hover:text-stone-600">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                    <path d="M11 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" />
                </svg>
            </button>
            <JsonViewSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
