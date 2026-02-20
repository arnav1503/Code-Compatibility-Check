# AruGPT Voice Assistant

## Overview

AruGPT is a web-based AI voice assistant with a futuristic cyberpunk-themed UI. It's a chatbot that can answer questions about science, grammar, geography, countries, do math, tell jokes, and learn new facts through a memory system. Users can interact via text input or voice (using the browser's Web Speech API). The backend processes messages through a rule-based response engine (no external AI API calls for chat — all logic is hardcoded in the server routes).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming; dark cyberpunk/space theme with neon cyan and purple accents; custom fonts (Orbitron for display, DM Sans/Inter for body)
- **Animations**: Framer Motion for chat message and UI transitions
- **Voice**: Native Web Speech API (SpeechRecognition for input, SpeechSynthesis for output) — no external voice libraries needed
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, run with `tsx` in development
- **API**: Single REST endpoint `POST /api/chat` that accepts a message and returns a response
- **Chat Engine**: Entirely rule-based — uses hardcoded knowledge dictionaries (science, grammar, geography, countries) and pattern matching (regex) for math, jokes, greetings, memory commands, etc. No external AI/LLM service is used.
- **Build**: esbuild bundles the server for production; Vite builds the client. The build script is at `script/build.ts`.

### Shared Code (`shared/`)
- **`schema.ts`**: Drizzle ORM schema defining a `memories` table (id, key, value) for the assistant's learned facts
- **`routes.ts`**: API contract types using Zod schemas — defines the chat endpoint input/output types

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL via `pg` (node-postgres) connection pool
- **Schema**: Single table `memories` with `id` (serial), `key` (unique text), `value` (text) — used for the "remember" and "recall" features
- **Migrations**: Generated via `drizzle-kit push` (`npm run db:push`)
- **Connection**: Requires `DATABASE_URL` environment variable

### Storage Layer (`server/storage.ts`)
- Implements `IStorage` interface with `DatabaseStorage` class
- Supports `getMemory`, `getAllMemories`, and `upsertMemory` (insert or update on conflict by key)

### Development vs Production
- **Dev**: Vite dev server with HMR runs as middleware on the Express server; uses `tsx` to run TypeScript directly
- **Prod**: Client is built to `dist/public/`, server is bundled to `dist/index.cjs` via esbuild; Express serves static files from `dist/public/`

## External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable
- **No external AI services**: The chat engine is entirely rule-based with hardcoded knowledge
- **No external voice services**: Uses browser-native Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Google Fonts**: Orbitron, Rajdhani, DM Sans, Fira Code, Geist Mono loaded via CDN
- **Replit plugins** (dev only): `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`