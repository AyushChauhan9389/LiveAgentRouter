"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Modality, Type as SchemaType } from "@google/genai";

// Audio configuration
const AUDIO_INPUT_SAMPLE_RATE = 16000;
const AUDIO_OUTPUT_SAMPLE_RATE = 24000;

// Worklet code as a static string
// Wrapped in a try-catch to prevent "already registered" errors from breaking the flow
const RECORDING_WORKLET_CODE = `
class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.index = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.index++] = channelData[i];
        if (this.index >= this.bufferSize) {
          this.port.postMessage(this.buffer);
          this.index = 0;
        }
      }
    }
    return true;
  }
}

try {
  registerProcessor('recorder-processor', RecorderProcessor);
} catch (e) {
  // Ignore if already registered
}
`;

export default function LivePage() {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [bgColor, setBgColor] = useState("bg-[#FFFDF5]");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [volume, setVolume] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const nextPlayTimeRef = useRef(0);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Track if worklet is loaded in the current context to avoid double-loading
  const isWorkletLoadedRef = useRef(false);

  useEffect(() => {
    addLog("SYSTEM_READY");
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setApiKey(storedKey);
    }
    return () => {
      disconnectFromGemini();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `> ${msg}`]);
  };

  // Initialize Audio Context
  const ensureAudioContext = async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: AUDIO_INPUT_SAMPLE_RATE,
      });
      
      // Reset worklet flag since we have a new context
      isWorkletLoadedRef.current = false;

      const analyzer = audioContextRef.current.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;
      
      startVisualizer();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  };

  const startVisualizer = () => {
    const update = () => {
      if (analyzerRef.current) {
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avg);
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const toggleConnection = async () => {
    if (isConnected) {
      disconnectFromGemini();
    } else {
      await connectToGemini();
    }
  };

  const connectToGemini = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      addLog("ERROR: MISSING_API_KEY");
      return;
    }

    try {
      const ctx = await ensureAudioContext();
      addLog("INIT_CONNECTION...");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
        },
        tools: [{
          functionDeclarations: [{
            name: "changeBackgroundColor",
            description: "Changes the background color. Use standard colors.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                color: { type: SchemaType.STRING, description: "Color name (red, blue, etc)." }
              },
              required: ["color"]
            }
          }]
        }]
      };

      const model = "gemini-2.5-flash-native-audio-preview-09-2025";

      sessionRef.current = await ai.live.connect({
        model,
        config,
        callbacks: {
          onopen: async () => {
            addLog("CONNECTION_ESTABLISHED");
            setIsConnected(true);
            await startAudioInput(ctx);
          },
          onmessage: async (message: any) => {
            console.log("Received message:", message);

            if (message.serverContent?.modelTurn?.parts) {
              const parts = message.serverContent.modelTurn.parts;
              console.log("Model turn parts:", parts.length);
              for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                  console.log("Playing audio response");
                  const pcmData = base64ToInt16(part.inlineData.data);
                  playAudioChunk(pcmData, ctx);
                }
              }
            }

            if (message.toolCall) {
              addLog("EXEC_TOOL: CHANGE_COLOR");
              handleToolCall(message.toolCall);
            }
          },
          onclose: (e: any) => {
            addLog(`DISCONNECTED: ${e.reason}`);
            setIsConnected(false);
          },
          onerror: (e: any) => {
            addLog(`ERROR: ${e.message}`);
          }
        }
      });

      // Send an initial text message after connection is established
      if (sessionRef.current) {
        sessionRef.current.sendClientContent({
          turns: [{
            role: "user",
            parts: [{
              text: "Hello! I'm listening. Feel free to talk to me or ask me to change the background color."
            }]
          }],
          turnComplete: true
        });
      }

    } catch (error: any) {
      addLog(`FATAL_ERROR: ${error.message}`);
      setIsConnected(false);
    }
  };

  const handleToolCall = (toolCall: any) => {
     const functionResponses = [];
     for (const fc of toolCall.functionCalls) {
        if (fc.name === "changeBackgroundColor") {
            const color = fc.args.color.toLowerCase();
            let newBg = "bg-[#FFFDF5]"; 
            
            if (color.includes("red")) newBg = "bg-[#FF6B6B]";
            else if (color.includes("blue")) newBg = "bg-[#4D96FF]";
            else if (color.includes("green")) newBg = "bg-[#6BCB77]";
            else if (color.includes("yellow")) newBg = "bg-[#FFD93D]";
            else if (color.includes("purple")) newBg = "bg-[#9D4EDD]";
            else if (color.includes("orange")) newBg = "bg-[#FF9F45]";
            else if (color.includes("pink")) newBg = "bg-[#FF99CC]";
            else if (color.includes("black")) newBg = "bg-[#2D2D2D]";
            else if (color.includes("white")) newBg = "bg-[#FFFFFF]";
            
            setBgColor(newBg);
            
            functionResponses.push({
                id: fc.id,
                name: fc.name,
                response: { result: "ok", color: newBg }
            });
        }
     }
     if (functionResponses.length > 0 && sessionRef.current) {
          sessionRef.current.sendToolResponse({ functionResponses });
     }
  };

  const disconnectFromGemini = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    stopAudioInput();
    setIsConnected(false);
    addLog("MANUAL_DISCONNECT");
  };

  // --- Audio Input (Mic) ---
  const startAudioInput = async (ctx: AudioContext) => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia not supported. Use HTTPS or modern browser.");
      }

      if (ctx.state === 'suspended') await ctx.resume();
      console.log("AudioContext state:", ctx.state, "Sample rate:", ctx.sampleRate);

      // Register worklet only if not already loaded in this context
      if (!isWorkletLoadedRef.current) {
        const blob = new Blob([RECORDING_WORKLET_CODE], { type: 'application/javascript' });
        const workletUrl = URL.createObjectURL(blob);

        try {
            await ctx.audioWorklet.addModule(workletUrl);
            isWorkletLoadedRef.current = true;
            console.log("Audio worklet registered successfully");
        } catch (e) {
            // If it fails, it might be because it was already registered (race condition or tracking error)
            console.warn("Worklet addModule warning:", e);
        }
      }

      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
          sampleRate: AUDIO_INPUT_SAMPLE_RATE
        } 
      });

      console.log("Microphone access granted. Stream tracks:", stream.getTracks().length);

      streamRef.current = stream;
      const source = ctx.createMediaStreamSource(stream);
      console.log("MediaStreamSource created");

      const workletNode = new AudioWorkletNode(ctx, 'recorder-processor');
      console.log("AudioWorkletNode created");

      let chunkCount = 0;
      workletNode.port.onmessage = (e) => {
        if (!sessionRef.current) {
          console.warn("Session not available, skipping audio chunk");
          return;
        }

        const inputData = e.data;
        const pcm16 = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcm16.buffer);

        // Log first few chunks to verify audio is being captured
        chunkCount++;
        if (chunkCount <= 3) {
          console.log(`Sending audio chunk ${chunkCount}, size: ${base64Audio.length}`);
        }

        sessionRef.current.sendRealtimeInput({
          audio: {
            mimeType: `audio/pcm;rate=${ctx.sampleRate}`,
            data: base64Audio
          }
        });
      };

      console.log("Worklet message handler attached");

      source.connect(workletNode);
      console.log("Source connected to worklet");

      // Connect to destination so the worklet's process() method gets called
      // Use a gain node with volume 0 to avoid feedback
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0; // Mute the microphone input to avoid feedback
      workletNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      console.log("Worklet connected to destination (muted)");

      workletNodeRef.current = workletNode;
      addLog("MIC_ACTIVE");

    } catch (err: any) {
      addLog(`MIC_ERROR: ${err.message}`);
    }
  };

  const stopAudioInput = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (workletNodeRef.current) {
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
    }
  };

  // --- Audio Output (Playback) ---
  const playAudioChunk = (pcmData: Int16Array, ctx: AudioContext) => {
    if (!pcmData || pcmData.length === 0) return;
    
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      float32Data[i] = pcmData[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32Data.length, AUDIO_OUTPUT_SAMPLE_RATE);
    buffer.copyToChannel(float32Data, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    if (analyzerRef.current) {
        source.connect(analyzerRef.current);
        analyzerRef.current.connect(ctx.destination);
    } else {
        source.connect(ctx.destination);
    }

    const currentTime = ctx.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime + 0.05;
    }

    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += buffer.duration;
  };


  // --- Helpers ---
  function floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  function base64ToInt16(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  return (
    <div className={`min-h-screen ${bgColor} text-black font-mono transition-colors duration-300 overflow-hidden relative selection:bg-black selection:text-white`}>
      
      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center h-screen relative z-10">
        
        {/* Header */}
        <div className="absolute top-8 bg-white border-4 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
           <h1 className="text-3xl font-black tracking-tighter uppercase italic">Gemini Live</h1>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-28 flex items-center justify-center gap-3 bg-white border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
             <div className={`w-3 h-3 border-2 border-black ${isConnected ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B]'}`}></div>
             <span className="text-xs font-bold tracking-widest uppercase">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
        </div>

        {/* BIG MIC BUTTON */}
        <button 
          onClick={toggleConnection}
          className={`
            relative w-56 h-56 rounded-full flex items-center justify-center transition-all duration-200 border-4 border-black
            ${isConnected 
              ? 'bg-[#FF6B6B] shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] translate-x-2 translate-y-2' 
              : 'bg-white hover:bg-gray-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-3 active:translate-y-3'
            }
          `}
        >
          {/* Visualizer Ring */}
          {isConnected && (
              <div 
                className="absolute rounded-full border-4 border-black opacity-20 transition-all duration-75"
                style={{
                    width: `${240 + (volume * 2)}px`,
                    height: `${240 + (volume * 2)}px`
                }}
              ></div>
          )}

          {/* Mic Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-24 h-24 transition-colors duration-200 ${isConnected ? 'text-black animate-bounce' : 'text-black'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Instructions */}
        <p className="mt-12 font-bold text-sm bg-white px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
          {isConnected ? "TAP TO END SESSION" : "TAP TO INITIALIZE"}
        </p>
        
        {/* Logs Display */}
        <div className="absolute bottom-24 w-full max-w-md px-4">
           <div className="h-40 overflow-y-auto text-xs text-black bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             {logs.length === 0 && <div className="opacity-50">WAITING_FOR_LOGS...</div>}
             {logs.slice().reverse().map((log, i) => (
               <div key={i} className="mb-1 font-bold">{log}</div>
             ))}
           </div>
        </div>

      </div>

      {/* Settings Floating Button */}
      <button 
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="absolute bottom-8 right-8 w-14 h-14 bg-[#FFD93D] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="square" strokeLinejoin="miter" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute bottom-28 right-8 w-80 bg-white p-6 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-20">
           <h3 className="text-xl font-black text-black mb-4 uppercase">Configuration</h3>
           <div className="mb-6">
             <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">Gemini API Key</label>
             <input 
               type="password" 
               value={apiKey}
               onChange={(e) => saveApiKey(e.target.value)}
               className="w-full bg-[#f0f0f0] border-4 border-black p-3 text-sm text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
               placeholder="AIza..."
             />
           </div>
           <button 
             onClick={() => setIsSettingsOpen(false)}
             className="w-full bg-[#4D96FF] border-4 border-black text-white font-black uppercase py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
           >
             Save & Close
           </button>
        </div>
      )}

    </div>
  );
}