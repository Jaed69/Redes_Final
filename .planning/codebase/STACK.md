# Technology Stack

**Analysis Date:** 2026-07-05

## Project Shape

This repo bundles two distinct deliverables for a networking course final project:

1. **VLSM subnetting exercise** — `Parcila_redes.pkt` (Cisco Packet Tracer topology), `VLSM Automatico.xlsx` / `VLSM Automatico.pdf` (subnet calculation spreadsheet) at repo root. No source code; not a runtime application.
2. **agrodroid** — a vineyard IoT monitoring application (`agrodroid/`) with three components:
   - `agrodroid/app` — Node.js/Express REST API
   - `agrodroid/db` — PostgreSQL schema + seed data (`init.sql`)
   - `agrodroid/web` — React/TypeScript SPA (Vite)

Orchestrated together via `agrodroid/docker-compose.yml`.

## Languages

**Primary:**
- JavaScript (CommonJS) - `agrodroid/app/**/*.js` (API backend)
- TypeScript (React/TSX) - `agrodroid/web/src/**/*.tsx`, `*.ts` (frontend)
- SQL (PostgreSQL dialect) - `agrodroid/db/init.sql`

**Secondary:**
- CSS - `agrodroid/web/src/styles/**/*.css`, `agrodroid/web/src/App.css`, `agrodroid/web/src/index.css`

## Runtime

**Environment:**
- Node.js 22 (Alpine) - declared in `agrodroid/app/dockerfile` (`FROM node:22-alpine`)
- No `.nvmrc` or engines field found in either `package.json`

**Package Manager:**
- npm - both `agrodroid/app` and `agrodroid/web` have `package-lock.json` (lockfiles present)

## Frameworks

**Backend (agrodroid/app):**
- Express 4.18.2 - `agrodroid/app/package.json`, entry `agrodroid/app/server.js`
- `pg` 8.16.0 (node-postgres) - PostgreSQL client, `agrodroid/app/config/db.js`
- `bcrypt` 6.0.0 - password hashing, `agrodroid/app/services/auth.service.js`
- `jsonwebtoken` 9.0.3 - JWT auth, `agrodroid/app/services/auth.service.js`, `agrodroid/app/middlewares/auth.middleware.js`
- `cors` 2.8.6 - CORS middleware, `agrodroid/app/server.js`

**Frontend (agrodroid/web):**
- React 19.2.7 + React DOM 19.2.7 - `agrodroid/web/package.json`
- React Router DOM 7.18.1 - client-side routing
- Vite 8.1.0 - dev server / build tool, `agrodroid/web/vite.config.ts` (uses `@vitejs/plugin-react`)
- TypeScript ~6.0.2 - `agrodroid/web/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Leaflet 1.9.4 + react-leaflet 5.0.0 - interactive maps (sensor/drone geolocation), `agrodroid/web/src/pages/Usuario/SensorMapView.tsx`
- Recharts 3.9.2 - charts/graphs for sensor readings, `agrodroid/web/src/components/DataReadOut.tsx` area

**Testing:**
- None detected in either `agrodroid/app` or `agrodroid/web` (no test framework, no `*.test.*`/`*.spec.*` files, no test script beyond `npm start`)

**Build/Dev:**
- Vite (dev server + build) - `agrodroid/web/vite.config.ts`
- ESLint 10.5.0 (flat config) - `agrodroid/web/eslint.config.js`, with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- No linter/formatter configured for `agrodroid/app` (no `.eslintrc`, no Prettier)
- Docker + Docker Compose - `agrodroid/docker-compose.yml`, `agrodroid/app/dockerfile`

## Key Dependencies

**Critical:**
- `pg` 8.16.0 - sole data access layer for the API; all controllers/services use raw SQL via `pool.query()` (no ORM), e.g. `agrodroid/app/services/auth.service.js`
- `jsonwebtoken` 9.0.3 - session/auth token issuance and verification
- `bcrypt` 6.0.0 - credential hashing on register/login

**Infrastructure:**
- `postgres:16` Docker image - database engine, `agrodroid/docker-compose.yml`
- `node:22-alpine` Docker image - API runtime base image, `agrodroid/app/dockerfile`

## Configuration

**Environment:**
- API config is read entirely from process env vars in `agrodroid/app/config/db.js` (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`) — no `.env` file present in the repo; values are injected via `agrodroid/docker-compose.yml` `environment:` block
- **Note:** `docker-compose.yml` hardcodes plaintext credentials (`POSTGRES_PASSWORD: admin123`, `JWT_SECRET: mipalabrasecreta`) directly in the compose file rather than via `.env`/secrets
- `JWT_SECRET` env var is defined in compose but **not actually consumed** — the code hardcodes its own secret string `"AgroDroid_2026"` in both `agrodroid/app/middlewares/auth.middleware.js` and `agrodroid/app/services/auth.service.js` instead of reading `process.env.JWT_SECRET`
- Frontend has no `.env` — API base URL is hardcoded as `"http://localhost:3000"` string literals scattered across `agrodroid/web/src/App.tsx`, `agrodroid/web/src/pages/Auth/Login.tsx`, `agrodroid/web/src/pages/Auth/Register.tsx` (no central config/service; `agrodroid/web/src/services/api.ts` exists but is empty)

**Build:**
- `agrodroid/web/tsconfig.json` (references `tsconfig.app.json`, `tsconfig.node.json`)
- `agrodroid/web/vite.config.ts` - minimal, just the React plugin
- `agrodroid/web/eslint.config.js` - flat ESLint config with TS + React Hooks/Refresh rules

## Platform Requirements

**Development:**
- Node.js 22.x (matches Docker base image) recommended for parity with the container
- PostgreSQL 16 client tooling for direct DB access (or via Docker)
- Docker + Docker Compose for local stack (`docker compose up` from `agrodroid/`)

**Production:**
- No production deployment configuration found (no CI/CD files, no cloud provider configs, no `.env.production`)
- `agrodroid/docker-compose.yml` is dev-oriented (hardcoded credentials, exposed DB port 5432, no volumes for persistence beyond seed script, no health checks/restart policies)

---

*Stack analysis: 2026-07-05*
