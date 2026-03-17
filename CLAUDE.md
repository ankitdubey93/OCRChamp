# OCRChamp — Claude Code Instructions

## Stack
- **Backend**: Node.js, Express, PostgreSQL (`pg`), TypeScript
- **Frontend**: React 19, Vite, Tailwind CSS v4, TypeScript
- **Monorepo**: npm workspaces (`backend/`, `frontend/`)

## TypeScript
- Strict mode is **mandatory** in both workspaces. Never disable `strict`, `noUnusedLocals`, `noUnusedParameters`, or `noImplicitReturns`.
- No `any`. Use `unknown` + narrowing or proper interfaces.
- All function return types must be explicit.

## Architecture
- **Backend** follows a strict 3-layer pattern: `routes` → `controllers` → `services`.
  - Controllers handle request parsing and response shaping only.
  - Services contain all business logic and are the **only** layer that imports `pool` or external APIs.
  - Routes wire HTTP methods to controller handlers.
- **Frontend** components live in `src/components/`, pages in `src/pages/`, API calls in `src/services/`.
- The `app.ts` / `index.ts` split is intentional: `app.ts` builds the Express app (importable in tests), `index.ts` calls `.listen()`.

## Code Style
- Always provide **complete, runnable code blocks** — no partial snippets, no ellipsis placeholders.
- Prefer `const` over `let`. No `var`.
- Async functions must use `async/await`; never mix with `.then()` chains.
- Error handling goes through the centralized `errorHandler` middleware via `ApiError`.

## Database
- Use raw `pg` (node-postgres). No ORM.
- All DB access goes through the `pool` singleton in `src/db/pool.ts`.
- SQL migrations live in `src/db/migrations/` as numbered `.sql` files.

## Environment
- Backend: `src/config/env.ts` validates and exports all env vars. Add new vars there first.
- Frontend: backend calls go through the Vite dev proxy at `/api` — no `VITE_API_BASE_URL` needed in dev.
- Never commit `.env` files.
