# Router

## Project Overview

**Router** is a Next.js application designed to visually manage and route data flows between various modules, including AI models and IoT devices. It features a drag-and-drop interface powered by `@xyflow/react` (React Flow), allowing users to construct complex processing pipelines. The application integrates with Supabase for backend services and real-time state synchronization. Devices fetched from Supabase are dynamically listed in the sidebar, and only one instance of each unique device can be placed on the canvas at a time.

### Key Features

*   **Visual Flow Builder:** Drag-and-drop interface to connect nodes.
*   **Dynamic Device Listing:** Devices fetched from Supabase are displayed in the sidebar with their names.
*   **Single Device Placement:** Only one instance of each unique device can be placed on the canvas, with disabled drag functionality for devices already in use.
*   **Node Types:**
    *   **Control Flow:** Start, Process, Router, End.
    *   **AI Models:** OpenAI, Gemini, HuggingFace, Live Agent.
    *   **Hardware:** Smart Fan, Smart Light, Smart AC (dynamically loaded).
    *   **Custom:** User-defined modules.
*   **Real-time Updates:** Device states are synchronized in real-time using Supabase channels, updating their corresponding nodes on the canvas.
*   **Modern Tech Stack:** Built on Next.js 16, React 19, and Tailwind CSS v4.

## Building and Running

The project uses standard `npm` scripts for development and building.

### Prerequisites

*   Node.js (v20+ recommended)
*   npm, yarn, pnpm, or bun

### Commands

*   **Start Development Server:**
    ```bash
    npm run dev
    # or
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

*   **Build for Production:**
    ```bash
    npm run build
    ```

*   **Start Production Server:**
    ```bash
    npm run start
    ```

*   **Lint Code:**
    ```bash
    npm run lint
    ```
    This project uses [Biome](https://biomejs.dev/) for linting.

*   **Format Code:**
    ```bash
    npm run format
    ```
    This project uses Biome for formatting.

## Architecture

### Directory Structure

*   `app/`: Next.js App Router pages and layouts.
    *   `page.tsx`: Main entry point. Fetches initial device data server-side.
    *   `layout.tsx`: Root layout definition.
    *   `globals.css`: Global styles and Tailwind imports.
*   `components/`: Reusable UI components.
    *   `flow/`: Components specific to the flow builder (Sidebar, FlowBuilder, Nodes).
    *   `nodes/`: Individual node component definitions (e.g., `GeminiNode`, `DeviceNode`).
*   `utils/`: Utility functions.
    *   `supabase/`: Supabase client and server configurations.
*   `script/`: Database migration scripts (`up.sql`, `down.sql`).
*   `proxy.ts`: Middleware proxy for handling Supabase sessions.

### Key Components

*   **`FlowBuilder.tsx`**: The core component that initializes the React Flow canvas. It now correctly loads initial devices from Supabase and displays them on the canvas. It handles the `realtime devices` channel subscription to update node states dynamically based on database changes. It also passes the list of all available devices and a list of currently used device IDs to the `Sidebar` component.
*   **`Sidebar.tsx`**: Provides the palette of draggable nodes. It now dynamically lists devices fetched from Supabase, showing their names. Devices already present on the canvas are marked as 'used' and are not draggable. It uses HTML5 Drag and Drop API to pass node type and metadata to the flow canvas.
*   **Supabase Integration**:
    *   `utils/supabase/client.ts`: Client-side Supabase client creator.
    *   `utils/supabase/server.ts`: Server-side Supabase client creator (for `page.tsx`).
    *   `utils/supabase/middleware.ts`: Middleware for session management.

## Development Conventions

*   **Styling:** Use Tailwind CSS classes. Global styles are minimal (`globals.css`).
*   **Formatting/Linting:** Adhere to Biome configuration (`biome.json`). Run `npm run format` before committing.
*   **State Management:**
    *   Flow state (`nodes`, `edges`) is managed via `@xyflow/react` hooks.
    *   Global/Async state (devices) is managed via Supabase and local effects in `FlowBuilder`.
*   **TypeScript:** Strict mode is enabled. Ensure all props and data structures are typed.

## Environment Variables

Ensure you have a `.env.local` file with the following Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```
