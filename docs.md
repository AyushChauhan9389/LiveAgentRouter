# Get started with Live API

# content\_copy

The Live API enables low-latency, real-time voice and video interactions with Gemini. It processes continuous streams of audio, video, or text to deliver immediate, human-like spoken responses, creating a natural conversational experience for your users.

![Live API Overview][image1]

Live API offers a comprehensive set of features such as [Voice Activity Detection](https://ai.google.dev/gemini-api/docs/live-guide#interruptions), [tool use and function calling](https://ai.google.dev/gemini-api/docs/live-tools), [session management](https://ai.google.dev/gemini-api/docs/live-session) (for managing long running conversations) and [ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens) (for secure client-sided authentication).

This page gets you up and running with examples and basic code samples.

[Try the Live API in Google AI Studiomic](https://aistudio.google.com/live)

## Example applications

Check out the following example applications that illustrate how to use Live API for end-to-end use cases:

* [Live audio starter app](https://aistudio.google.com/apps/bundled/live_audio?showPreview=true&showCode=true&showAssistant=false) on AI Studio, using JavaScript libraries to connect to Live API and stream bidirectional audio through your microphone and speakers.  
* Live API [Python cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.ipynb) using Pyaudio that connects to Live API.

## Partner integrations

If you prefer a simpler development process, you can use [Daily](https://www.daily.co/products/gemini/multimodal-live-api/), [LiveKit](https://docs.livekit.io/agents/integrations/google/#multimodal-live-api) or [Voximplant](https://voximplant.com/products/gemini-client). These are third-party partner platforms that have already integrated the Gemini Live API over the WebRTC protocol to streamline the development of real-time audio and video applications.

## Choose an implementation approach

When integrating with Live API, you'll need to choose one of the following implementation approaches:

* **Server-to-server**: Your backend connects to the Live API using [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). Typically, your client sends stream data (audio, video, text) to your server, which then forwards it to the Live API.  
* **Client-to-server**: Your frontend code connects directly to the Live API using [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to stream data, bypassing your backend.

**Note:** Client-to-server generally offers better performance for streaming audio and video, since it bypasses the need to send the stream to your backend first. It's also easier to set up since you don't need to implement a proxy that sends data from your client to your server and then your server to the API. However, for production environments, in order to mitigate security risks, we recommend using [ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens) instead of standard API keys.

## Get started

This example ***reads a WAV file***, sends it in the correct format, and saves the received data as WAV file.

You can send audio by converting it to 16-bit PCM, 16kHz, mono format, and you can receive audio by setting `AUDIO` as response modality. The output uses a sample rate of 24kHz.

[Python](https://ai.google.dev/gemini-api/docs/live#python)

[JavaScript](https://ai.google.dev/gemini-api/docs/live#javascript)

`// Test file: https://storage.googleapis.com/generativeai-downloads/data/16000.wav`  
`import { GoogleGenAI, Modality } from '@google/genai';`  
`import * as fs from "node:fs";`  
`import pkg from 'wavefile';  // npm install wavefile`  
`const { WaveFile } = pkg;`

`const ai = new GoogleGenAI({});`  
`// WARNING: Do not use API keys in client-side (browser based) applications`  
`// Consider using Ephemeral Tokens instead`  
`// More information at: https://ai.google.dev/gemini-api/docs/ephemeral-tokens`

`// New native audio model:`  
`const model = "gemini-2.5-flash-native-audio-preview-09-2025"`

`const config = {`  
  `responseModalities: [Modality.AUDIO],`  
  `systemInstruction: "You are a helpful assistant and answer in a friendly tone."`  
`};`

`async function live() {`  
    `const responseQueue = [];`

    `async function waitMessage() {`  
        `let done = false;`  
        `let message = undefined;`  
        `while (!done) {`  
            `message = responseQueue.shift();`  
            `if (message) {`  
                `done = true;`  
            `} else {`  
                `await new Promise((resolve) => setTimeout(resolve, 100));`  
            `}`  
        `}`  
        `return message;`  
    `}`

    `async function handleTurn() {`  
        `const turns = [];`  
        `let done = false;`  
        `while (!done) {`  
            `const message = await waitMessage();`  
            `turns.push(message);`  
            `if (message.serverContent && message.serverContent.turnComplete) {`  
                `done = true;`  
            `}`  
        `}`  
        `return turns;`  
    `}`

    `const session = await ai.live.connect({`  
        `model: model,`  
        `callbacks: {`  
            `onopen: function () {`  
                `console.debug('Opened');`  
            `},`  
            `onmessage: function (message) {`  
                `responseQueue.push(message);`  
            `},`  
            `onerror: function (e) {`  
                `console.debug('Error:', e.message);`  
            `},`  
            `onclose: function (e) {`  
                `console.debug('Close:', e.reason);`  
            `},`  
        `},`  
        `config: config,`  
    `});`

    `// Send Audio Chunk`  
    `const fileBuffer = fs.readFileSync("sample.wav");`

    `// Ensure audio conforms to API requirements (16-bit PCM, 16kHz, mono)`  
    `const wav = new WaveFile();`  
    `wav.fromBuffer(fileBuffer);`  
    `wav.toSampleRate(16000);`  
    `wav.toBitDepth("16");`  
    `const base64Audio = wav.toBase64();`

    `// If already in correct format, you can use this:`  
    `// const fileBuffer = fs.readFileSync("sample.pcm");`  
    `// const base64Audio = Buffer.from(fileBuffer).toString('base64');`

    `session.sendRealtimeInput(`  
        `{`  
            `audio: {`  
                `data: base64Audio,`  
                `mimeType: "audio/pcm;rate=16000"`  
            `}`  
        `}`

    `);`

    `const turns = await handleTurn();`

    `// Combine audio data strings and save as wave file`  
    `const combinedAudio = turns.reduce((acc, turn) => {`  
        `if (turn.data) {`  
            `const buffer = Buffer.from(turn.data, 'base64');`  
            `const intArray = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES_PER_ELEMENT);`  
            `return acc.concat(Array.from(intArray));`  
        `}`  
        `return acc;`  
    `}, []);`

    `const audioBuffer = new Int16Array(combinedAudio);`

    `const wf = new WaveFile();`  
    `wf.fromScratch(1, 24000, '16', audioBuffer);  // output is 24kHz`  
    `fs.writeFileSync('audio.wav', wf.toBuffer());`

    `session.close();`  
`}`

`async function main() {`  
    `await live().catch((e) => console.error('got error', e));`  
`}`

`main();`

Live API capabilities guide

content\_copy

Preview: The Live API is in preview.  
This is a comprehensive guide that covers capabilities and configurations available with the Live API. See Get started with Live API page for a overview and sample code for common use cases.

Before you begin  
Familiarize yourself with core concepts: If you haven't already done so, read the Get started with Live API page first. This will introduce you to the fundamental principles of the Live API, how it works, and the different implementation approaches.  
Try the Live API in AI Studio: You may find it useful to try the Live API in Google AI Studio before you start building. To use the Live API in Google AI Studio, select Stream.  
Establishing a connection  
The following example shows how to create a connection with an API key:

Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';  
const config \= { responseModalities: \[Modality.AUDIO\] };

async function main() {

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        console.debug(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  console.debug("Session started");  
  // Send content...

  session.close();  
}

main();  
Interaction modalities  
The following sections provide examples and supporting context for the different input and output modalities available in Live API.

Sending and receiving audio  
The most common audio example, audio-to-audio, is covered in the Getting started guide.

Audio formats  
Audio data in the Live API is always raw, little-endian, 16-bit PCM. Audio output always uses a sample rate of 24kHz. Input audio is natively 16kHz, but the Live API will resample if needed so any sample rate can be sent. To convey the sample rate of input audio, set the MIME type of each audio-containing Blob to a value like audio/pcm;rate=16000.

Sending text  
Here's how you can send text:

Python  
JavaScript

const message \= 'Hello, how are you?';  
session.sendClientContent({ turns: message, turnComplete: true });  
Incremental content updates  
Use incremental updates to send text input, establish session context, or restore session context. For short contexts you can send turn-by-turn interactions to represent the exact sequence of events:

Python  
JavaScript

let inputTurns \= \[  
  { "role": "user", "parts": \[{ "text": "What is the capital of France?" }\] },  
  { "role": "model", "parts": \[{ "text": "Paris" }\] },  
\]

session.sendClientContent({ turns: inputTurns, turnComplete: false })

inputTurns \= \[{ "role": "user", "parts": \[{ "text": "What is the capital of Germany?" }\] }\]

session.sendClientContent({ turns: inputTurns, turnComplete: true })  
For longer contexts it's recommended to provide a single message summary to free up the context window for subsequent interactions. See Session Resumption for another method for loading session context.

Audio transcriptions  
In addition to the model response, you can also receive transcriptions of both the audio output and the audio input.

To enable transcription of the model's audio output, send output\_audio\_transcription in the setup config. The transcription language is inferred from the model's response.

Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  outputAudioTranscription: {}  
};

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        responseQueue.push(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  const inputTurns \= 'Hello how are you?';  
  session.sendClientContent({ turns: inputTurns });

  const turns \= await handleTurn();

  for (const turn of turns) {  
    if (turn.serverContent && turn.serverContent.outputTranscription) {  
      console.debug('Received output transcription: %s\\n', turn.serverContent.outputTranscription.text);  
    }  
  }

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
To enable transcription of the model's audio input, send input\_audio\_transcription in setup config.

Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';  
import \* as fs from "node:fs";  
import pkg from 'wavefile';  
const { WaveFile } \= pkg;

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  inputAudioTranscription: {}  
};

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        responseQueue.push(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  // Send Audio Chunk  
  const fileBuffer \= fs.readFileSync("16000.wav");

  // Ensure audio conforms to API requirements (16-bit PCM, 16kHz, mono)  
  const wav \= new WaveFile();  
  wav.fromBuffer(fileBuffer);  
  wav.toSampleRate(16000);  
  wav.toBitDepth("16");  
  const base64Audio \= wav.toBase64();

  // If already in correct format, you can use this:  
  // const fileBuffer \= fs.readFileSync("sample.pcm");  
  // const base64Audio \= Buffer.from(fileBuffer).toString('base64');

  session.sendRealtimeInput(  
    {  
      audio: {  
        data: base64Audio,  
        mimeType: "audio/pcm;rate=16000"  
      }  
    }  
  );

  const turns \= await handleTurn();  
  for (const turn of turns) {  
    if (turn.text) {  
      console.debug('Received text: %s\\n', turn.text);  
    }  
    else if (turn.data) {  
      console.debug('Received inline data: %s\\n', turn.data);  
    }  
    else if (turn.serverContent && turn.serverContent.inputTranscription) {  
      console.debug('Received input transcription: %s\\n', turn.serverContent.inputTranscription.text);  
    }  
  }

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
Stream audio and video  
To see an example of how to use the Live API in a streaming audio and video format, run the "Live API \- Get Started" file in the cookbooks repository:

View on Colab

Change voice and language  
Native audio output models support any of the voices available for our Text-to-Speech (TTS) models. You can listen to all the voices in AI Studio.

To specify a voice, set the voice name within the speechConfig object as part of the session configuration:

Python  
JavaScript

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }  
};  
Note: If you're using the generateContent API, the set of available voices is slightly different. See the audio generation guide for generateContent audio generation voices.  
The Live API supports multiple languages. Native audio output models automatically choose the appropriate language and don't support explicitly setting the language code.

Native audio capabilities  
Our latest models feature native audio output, which provides natural, realistic-sounding speech and improved multilingual performance. Native audio also enables advanced features like affective (emotion-aware) dialogue, proactive audio (where the model intelligently decides when to respond to input), and "thinking".

Affective dialog  
This feature lets Gemini adapt its response style to the input expression and tone.

To use affective dialog, set the api version to v1alpha and set enable\_affective\_dialog to truein the setup message:

Python  
JavaScript

const ai \= new GoogleGenAI({ httpOptions: {"apiVersion": "v1alpha"} });

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  enableAffectiveDialog: true  
};  
Proactive audio  
When this feature is enabled, Gemini can proactively decide not to respond if the content is not relevant.

To use it, set the api version to v1alpha and configure the proactivity field in the setup message and set proactive\_audio to true:

Python  
JavaScript

const ai \= new GoogleGenAI({ httpOptions: {"apiVersion": "v1alpha"} });

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  proactivity: { proactiveAudio: true }  
}  
Thinking  
The latest native audio output model gemini-2.5-flash-native-audio-preview-09-2025 supports thinking capabilities, with dynamic thinking enabled by default.

The thinkingBudget parameter guides the model on the number of thinking tokens to use when generating a response. You can disable thinking by setting thinkingBudget to 0\. For more info on the thinkingBudget configuration details of the model, see the thinking budgets documentation.

Python  
JavaScript

const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';  
const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  thinkingConfig: {  
    thinkingBudget: 1024,  
  },  
};

async function main() {

  const session \= await ai.live.connect({  
    model: model,  
    config: config,  
    callbacks: ...,  
  });

  // Send audio input and receive audio

  session.close();  
}

main();  
Additionally, you can enable thought summaries by setting includeThoughts to true in your configuration. See thought summaries for more info:

Python  
JavaScript

const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';  
const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  thinkingConfig: {  
    thinkingBudget: 1024,  
    includeThoughts: true,  
  },  
};  
Voice Activity Detection (VAD)  
Voice Activity Detection (VAD) allows the model to recognize when a person is speaking. This is essential for creating natural conversations, as it allows a user to interrupt the model at any time.

When VAD detects an interruption, the ongoing generation is canceled and discarded. Only the information already sent to the client is retained in the session history. The server then sends a BidiGenerateContentServerContent message to report the interruption.

The Gemini server then discards any pending function calls and sends a BidiGenerateContentServerContent message with the IDs of the canceled calls.

Python  
JavaScript

const turns \= await handleTurn();

for (const turn of turns) {  
  if (turn.serverContent && turn.serverContent.interrupted) {  
    // The generation was interrupted

    // If realtime playback is implemented in your application,  
    // you should stop playing audio and clear queued playback here.  
  }  
}  
Automatic VAD  
By default, the model automatically performs VAD on a continuous audio input stream. VAD can be configured with the realtimeInputConfig.automaticActivityDetection field of the setup configuration.

When the audio stream is paused for more than a second (for example, because the user switched off the microphone), an audioStreamEnd event should be sent to flush any cached audio. The client can resume sending audio data at any time.

Python  
JavaScript

// example audio file to try:  
// URL \= "https://storage.googleapis.com/generativeai-downloads/data/hello\_are\_you\_there.pcm"  
// \!wget \-q $URL \-O sample.pcm  
import { GoogleGenAI, Modality } from '@google/genai';  
import \* as fs from "node:fs";

const ai \= new GoogleGenAI({});  
const model \= 'gemini-live-2.5-flash-preview';  
const config \= { responseModalities: \[Modality.TEXT\] };

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        responseQueue.push(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  // Send Audio Chunk  
  const fileBuffer \= fs.readFileSync("sample.pcm");  
  const base64Audio \= Buffer.from(fileBuffer).toString('base64');

  session.sendRealtimeInput(  
    {  
      audio: {  
        data: base64Audio,  
        mimeType: "audio/pcm;rate=16000"  
      }  
    }

  );

  // if stream gets paused, send:  
  // session.sendRealtimeInput({ audioStreamEnd: true })

  const turns \= await handleTurn();  
  for (const turn of turns) {  
    if (turn.text) {  
      console.debug('Received text: %s\\n', turn.text);  
    }  
    else if (turn.data) {  
      console.debug('Received inline data: %s\\n', turn.data);  
    }  
  }

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
With send\_realtime\_input, the API will respond to audio automatically based on VAD. While send\_client\_content adds messages to the model context in order, send\_realtime\_input is optimized for responsiveness at the expense of deterministic ordering.

Automatic VAD configuration  
For more control over the VAD activity, you can configure the following parameters. See API reference for more info.

Python  
JavaScript

import { GoogleGenAI, Modality, StartSensitivity, EndSensitivity } from '@google/genai';

const config \= {  
  responseModalities: \[Modality.TEXT\],  
  realtimeInputConfig: {  
    automaticActivityDetection: {  
      disabled: false, // default  
      startOfSpeechSensitivity: StartSensitivity.START\_SENSITIVITY\_LOW,  
      endOfSpeechSensitivity: EndSensitivity.END\_SENSITIVITY\_LOW,  
      prefixPaddingMs: 20,  
      silenceDurationMs: 100,  
    }  
  }  
};  
Disable automatic VAD  
Alternatively, the automatic VAD can be disabled by setting realtimeInputConfig.automaticActivityDetection.disabled to true in the setup message. In this configuration the client is responsible for detecting user speech and sending activityStart and activityEnd messages at the appropriate times. An audioStreamEnd isn't sent in this configuration. Instead, any interruption of the stream is marked by an activityEnd message.

Python  
JavaScript

const config \= {  
  responseModalities: \[Modality.TEXT\],  
  realtimeInputConfig: {  
    automaticActivityDetection: {  
      disabled: true,  
    }  
  }  
};

session.sendRealtimeInput({ activityStart: {} })

session.sendRealtimeInput(  
  {  
    audio: {  
      data: base64Audio,  
      mimeType: "audio/pcm;rate=16000"  
    }  
  }

);

session.sendRealtimeInput({ activityEnd: {} })  
Token count  
You can find the total number of consumed tokens in the usageMetadata field of the returned server message.

Python  
JavaScript

const turns \= await handleTurn();

for (const turn of turns) {  
  if (turn.usageMetadata) {  
    console.debug('Used %s tokens in total. Response token breakdown:\\n', turn.usageMetadata.totalTokenCount);

    for (const detail of turn.usageMetadata.responseTokensDetails) {  
      console.debug('%s\\n', detail);  
    }  
  }  
}  
Media resolution  
You can specify the media resolution for the input media by setting the mediaResolution field as part of the session configuration:

Python  
JavaScript

import { GoogleGenAI, Modality, MediaResolution } from '@google/genai';

const config \= {  
    responseModalities: \[Modality.TEXT\],  
    mediaResolution: MediaResolution.MEDIA\_RESOLUTION\_LOW,  
};  
Limitations  
Consider the following limitations of the Live API when you plan your project.

Response modalities  
You can only set one response modality (TEXT or AUDIO) per session in the session configuration. Setting both results in a config error message. This means that you can configure the model to respond with either text or audio, but not both in the same session.

Client authentication  
The Live API only provides server-to-server authentication by default. If you're implementing your Live API application using a client-to-server approach, you need to use ephemeral tokens to mitigate security risks.

Session duration  
Audio-only sessions are limited to 15 minutes, and audio plus video sessions are limited to 2 minutes. However, you can configure different session management techniques for unlimited extensions on session duration.

Context window  
A session has a context window limit of:

128k tokens for native audio output models  
32k tokens for other Live API models

Tool use with Live API

content\_copy

Tool use allows Live API to go beyond just conversation by enabling it to perform actions in the real-world and pull in external context while maintaining a real time connection. You can define tools such as Function calling and Google Search with the Live API.

Overview of supported tools  
Here's a brief overview of the available tools for Live API models:

Tool	gemini-2.5-flash-native-audio-preview-09-2025  
Search	Yes  
Function calling	Yes  
Google Maps	No  
Code execution	No  
URL context	No  
Function calling  
Live API supports function calling, just like regular content generation requests. Function calling lets the Live API interact with external data and programs, greatly increasing what your applications can accomplish.

You can define function declarations as part of the session configuration. After receiving tool calls, the client should respond with a list of FunctionResponse objects using the session.send\_tool\_response method.

See the Function calling tutorial to learn more.

Note: Unlike the generateContent API, the Live API doesn't support automatic tool response handling. You must handle tool responses manually in your client code.  
Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';  
import \* as fs from "node:fs";  
import pkg from 'wavefile';  // npm install wavefile  
const { WaveFile } \= pkg;

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';

// Simple function definitions  
const turn\_on\_the\_lights \= { name: "turn\_on\_the\_lights" } // , description: '...', parameters: { ... }  
const turn\_off\_the\_lights \= { name: "turn\_off\_the\_lights" }

const tools \= \[{ functionDeclarations: \[turn\_on\_the\_lights, turn\_off\_the\_lights\] }\]

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  tools: tools  
}

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      } else if (message.toolCall) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        responseQueue.push(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  const inputTurns \= 'Turn on the lights please';  
  session.sendClientContent({ turns: inputTurns });

  let turns \= await handleTurn();

  for (const turn of turns) {  
    if (turn.toolCall) {  
      console.debug('A tool was called');  
      const functionResponses \= \[\];  
      for (const fc of turn.toolCall.functionCalls) {  
        functionResponses.push({  
          id: fc.id,  
          name: fc.name,  
          response: { result: "ok" } // simple, hard-coded function response  
        });  
      }

      console.debug('Sending tool response...\\n');  
      session.sendToolResponse({ functionResponses: functionResponses });  
    }  
  }

  // Check again for new messages  
  turns \= await handleTurn();

  // Combine audio data strings and save as wave file  
  const combinedAudio \= turns.reduce((acc, turn) \=\> {  
      if (turn.data) {  
          const buffer \= Buffer.from(turn.data, 'base64');  
          const intArray \= new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES\_PER\_ELEMENT);  
          return acc.concat(Array.from(intArray));  
      }  
      return acc;  
  }, \[\]);

  const audioBuffer \= new Int16Array(combinedAudio);

  const wf \= new WaveFile();  
  wf.fromScratch(1, 24000, '16', audioBuffer);  // output is 24kHz  
  fs.writeFileSync('audio.wav', wf.toBuffer());

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
From a single prompt, the model can generate multiple function calls and the code necessary to chain their outputs. This code executes in a sandbox environment, generating subsequent BidiGenerateContentToolCall messages.

Asynchronous function calling  
Function calling executes sequentially by default, meaning execution pauses until the results of each function call are available. This ensures sequential processing, which means you won't be able to continue interacting with the model while the functions are being run.

If you don't want to block the conversation, you can tell the model to run the functions asynchronously. To do so, you first need to add a behavior to the function definitions:

Python  
JavaScript

import { GoogleGenAI, Modality, Behavior } from '@google/genai';

// Non-blocking function definitions  
const turn\_on\_the\_lights \= {name: "turn\_on\_the\_lights", behavior: Behavior.NON\_BLOCKING}

// Blocking function definitions  
const turn\_off\_the\_lights \= {name: "turn\_off\_the\_lights"}

const tools \= \[{ functionDeclarations: \[turn\_on\_the\_lights, turn\_off\_the\_lights\] }\]  
NON-BLOCKING ensures the function runs asynchronously while you can continue interacting with the model.

Then you need to tell the model how to behave when it receives the FunctionResponse using the scheduling parameter. It can either:

Interrupt what it's doing and tell you about the response it got right away (scheduling="INTERRUPT"),  
Wait until it's finished with what it's currently doing (scheduling="WHEN\_IDLE"),  
Or do nothing and use that knowledge later on in the discussion (scheduling="SILENT")

Python  
JavaScript

import { GoogleGenAI, Modality, Behavior, FunctionResponseScheduling } from '@google/genai';

// for a non-blocking function definition, apply scheduling in the function response:  
const functionResponse \= {  
  id: fc.id,  
  name: fc.name,  
  response: {  
    result: "ok",  
    scheduling: FunctionResponseScheduling.INTERRUPT  // Can also be WHEN\_IDLE or SILENT  
  }  
}  
Grounding with Google Search  
You can enable Grounding with Google Search as part of the session configuration. This increases the Live API's accuracy and prevents hallucinations. See the Grounding tutorial to learn more.

Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';  
import \* as fs from "node:fs";  
import pkg from 'wavefile';  // npm install wavefile  
const { WaveFile } \= pkg;

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';

const tools \= \[{ googleSearch: {} }\]  
const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  tools: tools  
}

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      } else if (message.toolCall) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

  const session \= await ai.live.connect({  
    model: model,  
    callbacks: {  
      onopen: function () {  
        console.debug('Opened');  
      },  
      onmessage: function (message) {  
        responseQueue.push(message);  
      },  
      onerror: function (e) {  
        console.debug('Error:', e.message);  
      },  
      onclose: function (e) {  
        console.debug('Close:', e.reason);  
      },  
    },  
    config: config,  
  });

  const inputTurns \= 'When did the last Brazil vs. Argentina soccer match happen?';  
  session.sendClientContent({ turns: inputTurns });

  let turns \= await handleTurn();

  let combinedData \= '';  
  for (const turn of turns) {  
    if (turn.serverContent && turn.serverContent.modelTurn && turn.serverContent.modelTurn.parts) {  
      for (const part of turn.serverContent.modelTurn.parts) {  
        if (part.executableCode) {  
          console.debug('executableCode: %s\\n', part.executableCode.code);  
        }  
        else if (part.codeExecutionResult) {  
          console.debug('codeExecutionResult: %s\\n', part.codeExecutionResult.output);  
        }  
        else if (part.inlineData && typeof part.inlineData.data \=== 'string') {  
          combinedData \+= atob(part.inlineData.data);  
        }  
      }  
    }  
  }

  // Convert the base64-encoded string of bytes into a Buffer.  
  const buffer \= Buffer.from(combinedData, 'binary');

  // The buffer contains raw bytes. For 16-bit audio, we need to interpret every 2 bytes as a single sample.  
  const intArray \= new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES\_PER\_ELEMENT);

  const wf \= new WaveFile();  
  // The API returns 16-bit PCM audio at a 24kHz sample rate.  
  wf.fromScratch(1, 24000, '16', intArray);  
  fs.writeFileSync('audio.wav', wf.toBuffer());

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
Combining multiple tools  
You can combine multiple tools within the Live API, increasing your application's capabilities even more:

Python  
JavaScript

const prompt \= \`Hey, I need you to do two things for me.

1\. Use Google Search to look up information about the largest earthquake in California the week of Dec 5 2024?  
2\. Then turn on the lights

Thanks\!  
\`

const tools \= \[  
  { googleSearch: {} },  
  { functionDeclarations: \[turn\_on\_the\_lights, turn\_off\_the\_lights\] }  
\]

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  tools: tools  
}

// ... remaining model call

Session management with Live API

content\_copy

In the Live API, a session refers to a persistent connection where input and output are streamed continuously over the same connection (read more about how it works). This unique session design enables low latency and supports unique features, but can also introduce challenges, like session time limits, and early termination. This guide covers strategies for overcoming the session management challenges that can arise when using the Live API.

Session lifetime  
Without compression, audio-only sessions are limited to 15 minutes, and audio-video sessions are limited to 2 minutes. Exceeding these limits will terminate the session (and therefore, the connection), but you can use context window compression to extend sessions to an unlimited amount of time.

The lifetime of a connection is limited as well, to around 10 minutes. When the connection terminates, the session terminates as well. In this case, you can configure a single session to stay active over multiple connections using session resumption. You'll also receive a GoAway message before the connection ends, allowing you to take further actions.

Context window compression  
To enable longer sessions, and avoid abrupt connection termination, you can enable context window compression by setting the contextWindowCompression field as part of the session configuration.

In the ContextWindowCompressionConfig, you can configure a sliding-window mechanism and the number of tokens that triggers compression.

Python  
JavaScript

const config \= {  
  responseModalities: \[Modality.AUDIO\],  
  contextWindowCompression: { slidingWindow: {} }  
};  
Session resumption  
To prevent session termination when the server periodically resets the WebSocket connection, configure the sessionResumption field within the setup configuration.

Passing this configuration causes the server to send SessionResumptionUpdate messages, which can be used to resume the session by passing the last resumption token as the SessionResumptionConfig.handle of the subsequent connection.

Resumption tokens are valid for 2 hr after the last sessions termination.

Python  
JavaScript

import { GoogleGenAI, Modality } from '@google/genai';

const ai \= new GoogleGenAI({});  
const model \= 'gemini-2.5-flash-native-audio-preview-09-2025';

async function live() {  
  const responseQueue \= \[\];

  async function waitMessage() {  
    let done \= false;  
    let message \= undefined;  
    while (\!done) {  
      message \= responseQueue.shift();  
      if (message) {  
        done \= true;  
      } else {  
        await new Promise((resolve) \=\> setTimeout(resolve, 100));  
      }  
    }  
    return message;  
  }

  async function handleTurn() {  
    const turns \= \[\];  
    let done \= false;  
    while (\!done) {  
      const message \= await waitMessage();  
      turns.push(message);  
      if (message.serverContent && message.serverContent.turnComplete) {  
        done \= true;  
      }  
    }  
    return turns;  
  }

console.debug('Connecting to the service with handle %s...', previousSessionHandle)  
const session \= await ai.live.connect({  
  model: model,  
  callbacks: {  
    onopen: function () {  
      console.debug('Opened');  
    },  
    onmessage: function (message) {  
      responseQueue.push(message);  
    },  
    onerror: function (e) {  
      console.debug('Error:', e.message);  
    },  
    onclose: function (e) {  
      console.debug('Close:', e.reason);  
    },  
  },  
  config: {  
    responseModalities: \[Modality.AUDIO\],  
    sessionResumption: { handle: previousSessionHandle }  
    // The handle of the session to resume is passed here, or else null to start a new session.  
  }  
});

const inputTurns \= 'Hello how are you?';  
session.sendClientContent({ turns: inputTurns });

const turns \= await handleTurn();  
for (const turn of turns) {  
  if (turn.sessionResumptionUpdate) {  
    if (turn.sessionResumptionUpdate.resumable && turn.sessionResumptionUpdate.newHandle) {  
      let newHandle \= turn.sessionResumptionUpdate.newHandle  
      // ...Store newHandle and start new session with this handle here  
    }  
  }  
}

  session.close();  
}

async function main() {  
  await live().catch((e) \=\> console.error('got error', e));  
}

main();  
Receiving a message before the session disconnects  
The server sends a GoAway message that signals that the current connection will soon be terminated. This message includes the timeLeft, indicating the remaining time and lets you take further action before the connection will be terminated as ABORTED.

Python  
JavaScript

const turns \= await handleTurn();

for (const turn of turns) {  
  if (turn.goAway) {  
    console.debug('Time left: %s\\n', turn.goAway.timeLeft);  
  }  
}  
Receiving a message when the generation is complete  
The server sends a generationComplete message that signals that the model finished generating the response.

Python  
JavaScript

const turns \= await handleTurn();

for (const turn of turns) {  
  if (turn.serverContent && turn.serverContent.generationComplete) {  
    // The generation is complete  
  }  
}

# Ephemeral tokens

# content\_copy

Ephemeral tokens are short-lived authentication tokens for accessing the Gemini API through [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). They are designed to enhance security when you are connecting directly from a user's device to the API (a [client-to-server](https://ai.google.dev/gemini-api/docs/live#implementation-approach) implementation). Like standard API keys, ephemeral tokens can be extracted from client-side applications such as web browsers or mobile apps. But because ephemeral tokens expire quickly and can be restricted, they significantly reduce the security risks in a production environment. You should use them when accessing the Live API directly from client-side applications to enhance API key security.

**Note:** At this time, ephemeral tokens are only compatible with [Live API](https://ai.google.dev/gemini-api/docs/live).

## How ephemeral tokens work

Here's how ephemeral tokens work at a high level:

1. Your client (e.g. web app) authenticates with your backend.  
2. Your backend requests an ephemeral token from Gemini API's provisioning service.  
3. Gemini API issues a short-lived token.  
4. Your backend sends the token to the client for WebSocket connections to Live API. You can do this by swapping your API key with an ephemeral token.  
5. The client then uses the token as if it were an API key.

![Ephemeral tokens overview][image2]

This enhances security because even if extracted, the token is short-lived, unlike a long-lived API key deployed client-side. Since the client sends data directly to Gemini, this also improves latency and avoids your backends needing to proxy the real time data.

## Create an ephemeral token

Here is a simplified example of how to get an ephemeral token from Gemini. By default, you'll have 1 minute to start new Live API sessions using the token from this request (`newSessionExpireTime`), and 30 minutes to send messages over that connection (`expireTime`).

[Python](https://ai.google.dev/gemini-api/docs/ephemeral-tokens#python)

[JavaScript](https://ai.google.dev/gemini-api/docs/ephemeral-tokens#javascript)

`import { GoogleGenAI } from "@google/genai";`

`const client = new GoogleGenAI({});`  
`const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();`

  `const token: AuthToken = await client.authTokens.create({`  
    `config: {`  
      `uses: 1, // The default`  
      `expireTime: expireTime // Default is 30 mins`  
      `newSessionExpireTime: new Date(Date.now() + (1 * 60 * 1000)), // Default 1 minute in the future`  
      `httpOptions: {apiVersion: 'v1alpha'},`  
    `},`  
  `});`

For `expireTime` value constraints, defaults, and other field specs, see the [API reference](https://ai.google.dev/api/live#ephemeral-auth-tokens). Within the `expireTime` timeframe, you'll need [`sessionResumption`](https://ai.google.dev/gemini-api/docs/live-session#session-resumption) to reconnect the call every 10 minutes (this can be done with the same token even if `uses: 1`).

It's also possible to lock an ephemeral token to a set of configurations. This might be useful to further improve security of your application and keep your system instructions on the server side.

[Python](https://ai.google.dev/gemini-api/docs/ephemeral-tokens#python)

[JavaScript](https://ai.google.dev/gemini-api/docs/ephemeral-tokens#javascript)

`import { GoogleGenAI } from "@google/genai";`

`const client = new GoogleGenAI({});`  
`const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();`

`const token = await client.authTokens.create({`  
    `config: {`  
        `uses: 1, // The default`  
        `expireTime: expireTime,`  
        `liveConnectConstraints: {`  
            `model: 'gemini-2.5-flash-native-audio-preview-09-2025',`  
            `config: {`  
                `sessionResumption: {},`  
                `temperature: 0.7,`  
                `responseModalities: ['AUDIO']`  
            `}`  
        `},`  
        `httpOptions: {`  
            `apiVersion: 'v1alpha'`  
        `}`  
    `}`  
`});`

`// You'll need to pass the value under token.name back to your client to use it`

You can also lock a subset of fields, see the [SDK documentation](https://googleapis.github.io/python-genai/genai.html#genai.types.CreateAuthTokenConfig.lock_additional_fields) for more info.

## Connect to Live API with an ephemeral token

Once you have an ephemeral token, you use it as if it were an API key (but remember, it only works for the live API, and only with the `v1alpha` version of the API).

The use of ephemeral tokens only adds value when deploying applications that follow [client-to-server implementation](https://ai.google.dev/gemini-api/docs/live#implementation-approach) approach.

[JavaScript](https://ai.google.dev/gemini-api/docs/ephemeral-tokens#javascript)

`import { GoogleGenAI, Modality } from '@google/genai';`

`// Use the token generated in the "Create an ephemeral token" section here`  
`const ai = new GoogleGenAI({`  
  `apiKey: token.name`  
`});`  
`const model = 'gemini-2.5-flash-native-audio-preview-09-2025';`  
`const config = { responseModalities: [Modality.AUDIO] };`

`async function main() {`

  `const session = await ai.live.connect({`  
    `model: model,`  
    `config: config,`  
    `callbacks: { ... },`  
  `});`

  `// Send content...`

  `session.close();`  
`}`

`main();`

**Note:** If not using the SDK, note that ephemeral tokens must either be passed in an **`access_token`** query parameter, or in an HTTP **`Authorization`** prefixed by the [auth-scheme](https://datatracker.ietf.org/doc/html/rfc7235#section-2.1) **`Token`**.

See [Get started with Live API](https://ai.google.dev/gemini-api/docs/live) for more examples.

## Best practices

* Set a short expiration duration using the `expire_time` parameter.  
* Tokens expire, requiring re-initiation of the provisioning process.  
* Verify secure authentication for your own backend. Ephemeral tokens will only be as secure as your backend authentication method.  
* Generally, avoid using ephemeral tokens for backend-to-Gemini connections, as this path is typically considered secure.  
* 

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>