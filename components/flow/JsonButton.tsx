"use client";

import { useNodes, useEdges } from "@xyflow/react";
import React, { useState, useEffect } from "react";

interface JsonViewProps {
  isOpen: boolean;
  onClose: () => void;
}

function JsonViewSidebar({ isOpen, onClose }: JsonViewProps) {
  const nodes = useNodes();
  const edges = useEdges();
  const [jsonOutput, setJsonOutput] = useState<string>("");

  // Update JSON whenever the sidebar is opened or nodes/edges change
  useEffect(() => {
    if (isOpen) {
      let currentNodes = nodes;
      let currentEdges = edges;

      // Fallback to local storage if React Flow hasn't populated yet or is empty
      if (currentNodes.length === 0) {
         const saved = localStorage.getItem('flow-storage');
         if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.nodes) currentNodes = parsed.nodes;
                if (parsed.edges) currentEdges = parsed.edges;
            } catch(e) {}
         }
      }

      // Categorize nodes
      const routerTypes = ['router', 'globalConnector', 'start', 'end', 'process'];
      const modelTypes = ['openai', 'gemini', 'huggingface', 'claude', 'liveAgent'];
      const deviceTypes = ['device'];

      const routerNodes = currentNodes.filter(n => routerTypes.includes(n.type || ''));
      const modelNodes = currentNodes.filter(n => modelTypes.includes(n.type || ''));
      const deviceNodes = currentNodes.filter(n => deviceTypes.includes(n.type || ''));
      const otherNodes = currentNodes.filter(n => !routerTypes.includes(n.type || '') && !modelTypes.includes(n.type || '') && !deviceTypes.includes(n.type || ''));

      const formattedFlowData = {
        RouterConfiguration: {
            ControlFlow: routerNodes.map(node => ({
                id: node.id,
                type: node.type,
                label: node.data.label,
                position: node.position,
                data: node.data
            })),
            UserModules: otherNodes.map(node => ({
                id: node.id,
                type: node.type,
                label: node.data.label,
                position: node.position,
                data: node.data
            }))
        },
        ModelsConnected: modelNodes.map(node => ({
            id: node.id,
            type: node.type,
            label: node.data.label,
            model: node.data.model, // Explicitly showing model selection
            position: node.position,
            data: node.data
        })),
        "Devices/Loots": deviceNodes.map(node => ({
            id: node.id,
            type: node.type,
            label: node.data.label,
            status: node.data.is_on ? 'Online' : 'Offline',
            position: node.position,
            data: node.data
        })),
        Links: currentEdges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
        }))
      };

      setJsonOutput(JSON.stringify(formattedFlowData, null, 2));
    }
  }, [isOpen, nodes, edges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-[90vw] h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <h2 className="text-lg font-bold text-stone-800 uppercase tracking-wide">
            Flow Configuration JSON
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-stone-50/50">
          <pre className="text-xs md:text-sm text-stone-700 font-mono leading-relaxed">
            {jsonOutput}
          </pre>
        </div>

        <div className="p-4 border-t border-stone-200 bg-white flex justify-end">
          <button
            onClick={() => {
              navigator.clipboard.writeText(jsonOutput);
              alert("JSON copied to clipboard!");
            }}
            className="px-6 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-md active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
              <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
            </svg>
            Copy to Clipboard
          </button>
        </div>
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
        className="relative px-3 py-2 bg-white border border-stone-200 shadow-lg rounded-lg hover:bg-stone-50 transition-all active:scale-95 flex items-center gap-2 group"
      >
        <span className="font-mono text-xs font-bold text-stone-600 group-hover:text-stone-900 uppercase">
          JSON
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-stone-400 group-hover:text-stone-600"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
            clipRule="evenodd"
          />
          <path d="M11 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" />
        </svg>
      </button>
      <JsonViewSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
