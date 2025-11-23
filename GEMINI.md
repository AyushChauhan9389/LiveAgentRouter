# Project Context: Router

## Project Overview
This is a web application built with **Next.js 16** (App Router) and **React 19**, utilizing **TypeScript**. The project is set up for high performance and modern development standards, featuring the **React Compiler** and **Tailwind CSS v4**.

### Key Technologies
*   **Framework:** Next.js 16.0.3
*   **UI Library:** React 19.2.0
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 (configured via CSS imports and variables)
*   **Toolchain:** Biome (Linting & Formatting), Bun (Package Manager)
*   **Fonts:** Geist Sans and Geist Mono (via `next/font`)

## Building and Running

This project uses **Bun** as the preferred package manager (indicated by `bun.lock`), but standard `npm` scripts are available.

### Key Commands
*   **Install Dependencies:**
    ```bash
    bun install
    ```
*   **Development Server:**
    ```bash
    bun dev
    # Runs on http://localhost:3000
    ```
*   **Build for Production:**
    ```bash
    bun run build
    ```
*   **Start Production Server:**
    ```bash
    bun start
    ```

## Development Conventions

### Code Style & Linting
*   **Linter/Formatter:** **Biome** is used instead of ESLint/Prettier.
*   **Check Issues:**
    ```bash
    bun run lint  # Runs `biome check`
    ```
*   **Fix Issues/Format:**
    ```bash
    bun run format # Runs `biome format --write`
    ```
*   **Indentation:** 2 spaces (enforced by Biome).
*   **Imports:** Organized automatically by Biome on save/format.

### Architecture & Structure
*   **App Router:** Uses the `app/` directory structure.
    *   `app/layout.tsx`: Root layout containing font definitions and global styles.
    *   `app/page.tsx`: Main entry point rendering the **React Flow** editor.
    *   `app/globals.css`: Tailwind v4 configuration and global theme variables.
*   **Features:**
    *   **Flow Editor:** Implemented in `components/flow/`, featuring a drag-and-drop sidebar and custom nodes.
    *   `components/nodes/`: Contains custom React Flow node definitions.
*   **Configuration:**
    *   `next.config.ts`: Enables `reactCompiler`.
    *   `biome.json`: Configuration for linter and formatter.

### Styling
*   Uses **Tailwind CSS v4**.
*   Theme variables (colors, fonts) are defined in `app/globals.css` using the `@theme` directive and CSS variables.
*   Dark mode is supported via `@media (prefers-color-scheme: dark)` media query in `app/globals.css`.
