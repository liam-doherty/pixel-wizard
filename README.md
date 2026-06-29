# Pixel Wizard

A browser-based pixel art editor. Draw on a 2D grid, import and auto-pixelate images, generate pixel art from a text prompt using Google Gemini, manage a personal collection, and export as a scaled PNG.

## Features

- Freehand painting with click and click-drag
- Right-click any cell to pick its colour (eyedropper)
- Adjustable grid size from 4×4 to 32×32
- Import PNG/JPEG — automatically resized and pixelated (RGBA-safe)
- AI generation via Gemini 2.5 Flash Lite from a text description
- Persistent sample collection with scrollable panel, add, and remove
- PNG export at up to 64× scale
- Favourite colours, RGB sliders, and default colour swatches

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | SolidJS, TanStack Query, Vite, Tailwind CSS v4, DaisyUI v5 |
| Backend | Hono on Node.js, Sharp, `@google/genai` |
| Shared | Zod schemas (`PixelImage`, `Player`) built with Vite |
| Tooling | pnpm workspaces, TypeScript, ESLint, Prettier, Vitest |

## Project structure

```
apps/web-app      # SolidJS frontend
services/api      # Hono REST API (port 3000)
libs/common       # Shared Zod types
```

## Prerequisites

- Node.js 20+
- pnpm 11.9+

## Setup

**1. Install dependencies**

```bash
pnpm install
```

**2. Configure the API**

Create `services/api/.env`:

```env
GEMINI_API_KEY=your_key_here
GOOGLE_CLOUD_PROJECT=your_project_id   # optional, for Vertex AI
```

A Gemini API key is required to use the AI generation feature. You can get one at [Google AI Studio](https://aistudio.google.com/).

**3. Start the dev servers**

Run each in a separate terminal:

```bash
# Shared library (watch mode)
pnpm dev:common

# API server — http://localhost:3000
pnpm dev:api

# Frontend — http://localhost:5173
pnpm dev:app
```

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/images/samples` | Returns the built-in sample images |
| `POST` | `/images/upload?size=N` | Upload an image, returns a pixelated `PixelImage` |
| `POST` | `/images/png?scale=N` | Convert a `PixelImage` to a scaled PNG download |
| `POST` | `/images/generate` | Generate a `PixelImage` from a text description via Gemini |
