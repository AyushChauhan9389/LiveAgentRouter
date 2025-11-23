"use client";

import React, { useState } from "react";

interface SidebarProps {
  devices: any[];
  usedDeviceIds: string[];
}

export default function Sidebar({
  devices = [],
  usedDeviceIds = [],
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    label: string,
    meta?: Record<string, any>,
  ) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/label", label);
    if (meta) {
      event.dataTransfer.setData(
        "application/reactflow/meta",
        JSON.stringify(meta),
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };

  const isDeviceUsed = (deviceId: string) =>
    usedDeviceIds.includes(deviceId.toString());

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "fan":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 animate-spin"
          >
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        );
      case "light":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3"
          >
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        );
      case "AC":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3"
          >
            <path
              fillRule="evenodd"
              d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9.725 9.725 0 0 0 4.1 9.911a.75.75 0 0 0 .71.346 8.262 8.262 0 0 1 2.287-.495 7.68 7.68 0 0 1 4.566 4.566 8.262 8.262 0 0 1 .495 2.287.75.75 0 0 0 .346.71 9.725 9.725 0 0 0 3.38 1.404.75.75 0 0 0 .082-1.152 7.547 7.547 0 0 1 1.715-1.705 9.742 9.742 0 0 0 6.177-3.539.75.75 0 0 0-.136-1.072 9.753 9.753 0 0 0-2.262-1.566 9.753 9.753 0 0 0-1.566-2.263 9.753 9.753 0 0 0-2.263-1.566 9.753 9.753 0 0 0-1.566-2.262 9.752 9.752 0 0 0-2.262-1.566Z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return <div className="w-3 h-3 rounded-full bg-cyan-500"></div>;
    }
  };

  return (
    <aside className="absolute top-4 left-4 z-40 flex flex-col gap-2 font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-stone-200 shadow-lg rounded-xl hover:bg-stone-50 transition-all active:scale-95 w-64 justify-between group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-stone-100 rounded-lg group-hover:bg-stone-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-stone-600"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-bold text-stone-800 text-sm uppercase tracking-wide">
            Modules
          </span>
        </div>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-stone-400"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[80vh] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}
      `}
      >
        <div className="w-64 bg-white/90 backdrop-blur-md border border-stone-200 shadow-xl rounded-xl p-4 overflow-y-auto max-h-[75vh] flex flex-col gap-5">
          {/* Core Section */}
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">
              Control Flow
            </div>
            <div className="space-y-2">
              {/* Start Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) => onDragStart(event, "start", "Start")}
                draggable
              >
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-1 hover:shadow-md hover:border-lime-300 transition-all">
                  <div className="p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
                      <span className="font-mono text-[10px] font-bold text-lime-900 uppercase">
                        Start
                      </span>
                    </div>
                    <div className="w-4 h-4 rounded bg-lime-200 flex items-center justify-center text-lime-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, "process", "Process")
                }
                draggable
              >
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-1 hover:shadow-md hover:border-amber-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="font-mono text-[10px] font-bold text-amber-900 uppercase">
                      Processor
                    </span>
                  </div>
                </div>
              </div>

              {/* Router Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) => onDragStart(event, "router", "Router")}
                draggable
              >
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-1 hover:shadow-md hover:border-indigo-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <span className="font-mono text-[10px] font-bold text-indigo-900 uppercase">
                      Router
                    </span>
                  </div>
                </div>
              </div>

              {/* Global Connector Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, "globalConnector", "Global Connector")
                }
                draggable
              >
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-1 hover:shadow-md hover:border-purple-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <span className="font-mono text-[10px] font-bold text-purple-900 uppercase">
                      Connector
                    </span>
                  </div>
                </div>
              </div>

              {/* End Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) => onDragStart(event, "end", "End")}
                draggable
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-1 hover:shadow-md hover:border-red-300 transition-all">
                  <div className="p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-sm bg-red-600"></div>
                      <span className="font-mono text-[10px] font-bold text-red-900 uppercase">
                        End
                      </span>
                    </div>
                    <div className="w-4 h-4 rounded bg-red-200 flex items-center justify-center text-red-700">
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Models Section */}
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">
              Neural Units
            </div>
            <div className="space-y-2">
              {/* OpenAI Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, "openai", "GPT-4 Turbo")
                }
                draggable
              >
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-1 hover:shadow-md hover:border-teal-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    <span className="font-mono text-[10px] font-bold text-teal-900 uppercase">
                      OpenAI
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) => onDragStart(event, "gemini", "Gemini")}
                draggable
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-1 hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="font-mono text-[10px] font-bold text-blue-900 uppercase">
                      Gemini
                    </span>
                  </div>
                </div>
              </div>

              {/* Hugging Face Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, "huggingface", "Hugging Face")
                }
                draggable
              >
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1 hover:shadow-md hover:border-yellow-300 transition-all">
                  <div className="p-2 flex items-center gap-2">
                    <span className="text-xs">🤗</span>
                    <span className="font-mono text-[10px] font-bold text-yellow-900 uppercase">
                      Hugging Face
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Agent Preview */}
              <div
                className="relative group cursor-grab active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, "liveAgent", "Live Agent")
                }
                draggable
              >
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-1 hover:shadow-md hover:border-rose-300 transition-all">
                  <div className="p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-rose-100">
                        <div className="absolute w-full h-full bg-rose-400 rounded-full animate-ping opacity-20"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-2.5 h-2.5 text-rose-600"
                        >
                          <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                          <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-rose-900 uppercase">
                        Live Agent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hardware Section */}
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">
              Hardware Units
            </div>
            <div className="space-y-2">
              {devices.map((device) => {
                const isUsed = isDeviceUsed(device.id);
                return (
                  <div
                    key={device.id}
                    className={`relative group ${isUsed ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
                    draggable={!isUsed}
                    onDragStart={(event) =>
                      !isUsed &&
                      onDragStart(event, "device", device.device_name, {
                        ...device,
                        db_id: device.id,
                      })
                    }
                  >
                    <div
                      className={`bg-cyan-50 border border-cyan-200 rounded-lg p-1 transition-all ${!isUsed ? "hover:shadow-md hover:border-cyan-300" : ""}`}
                    >
                      <div className="p-2 flex items-center gap-2">
                        <div className="p-1 rounded-full bg-cyan-500 text-white">
                          {getDeviceIcon(device.device_type)}
                        </div>
                        <span className="font-mono text-[10px] font-bold text-cyan-900 uppercase">
                          {device.device_name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {devices.length === 0 && (
                <div className="text-[10px] font-mono text-stone-400 italic pl-2">
                  No devices found
                </div>
              )}
            </div>
          </div>

          {/* Custom Section */}
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">
              User Modules
            </div>

            {/* Custom Preview */}
            <div
              className="relative group cursor-grab active:cursor-grabbing"
              onDragStart={(event) =>
                onDragStart(event, "custom", "Custom Node")
              }
              draggable
            >
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-1 hover:shadow-md hover:border-stone-300 transition-all">
                <div className="p-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
                  <span className="font-mono text-[10px] font-bold text-stone-900 uppercase">
                    Custom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
