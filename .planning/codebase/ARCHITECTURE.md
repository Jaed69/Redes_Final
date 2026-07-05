<!-- refreshed: 2026-07-05 -->
# Architecture

**Analysis Date:** 2026-07-05

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              React SPA (Vite + TypeScript)                   │
│  `agrodroid/web/src/`                                         │
├──────────────────┬──────────────────┬───────────────────────┤
│   Auth pages     │  Usuario views   │   Shared components   │
│ `src/pages/Auth` │`src/pages/Usuario`│  `src/components/`    │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │  fetch()/localStorage token           │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Express REST API  `agrodroid/app/`                   │
│  routes/ → middlewares/ → controllers/ → services/            │
└────────┬──────────────────────────────────────────────────────┘
         │  pg.Pool (raw SQL)
         ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL 16  (docker service `db`)                         │
│  Schema: `agrodroid/db/init.sql`                               │
└─────────────────────────────────────────────────────────────┘
```

Deployment is orchestrated by `agrodroid/docker-compose.yml`, which defines two services: `db` (Postgres 16, seeded from `agrodroid/db/init.sql`) and `app` (Node/Express API built from `agrodroid/app/dockerfile`, port 3000). The `web/` frontend is not in docker-compose — it runs separately via Vite dev server / static build and talks to the API at a hardcoded `http://localhost:3000` base URL.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Express bootstrap | Mounts all routers, CORS, JSON body parsing, port listen | `agrodroid/app/server.js` |
| Routes | Declare REST endpoints per resource, attach `verificarToken` middleware | `agrodroid/app/routes/*.routes.js` |
| Auth middleware | Verifies JWT on protected routes, injects `req.usuario` | `agrodroid/app/middlewares/auth.middleware.js` |
| Controllers | HTTP layer: parse req, call service, shape res/status codes | `agrodroid/app/controllers/*.controller.js` |
| Services | Business logic + raw SQL queries via `pg` | `agrodroid/app/services/*.service.js` |
| DB pool | Single shared `pg.Pool` configured from env vars | `agrodroid/app/config/db.js` |
| DB schema/seed | Table definitions and initial data, mounted into Postgres container on first boot | `agrodroid/db/init.sql` |
| React app shell | Top-level routing, global data fetch/state, passes props down | `agrodroid/web/src/App.tsx` |
| App layout | Authenticated shell (navbar + sidebar) wrapping nested routes via `<Outlet/>` | `agrodroid/web/src/pages/Usuario/Applayout.tsx` |
| Feature views | One view per domain concept (dashboard, map, readings, drones, disease detection, alerts) | `agrodroid/web/src/pages/Usuario/*.tsx` |
| Auth views | Login/Register forms, own API calls | `agrodroid/web/src/pages/Auth/*.tsx` |
| Shared components | Navbar, Sidebar, StatCard, DataReadOut — presentational, prop-driven | `agrodroid/web/src/components/*.tsx` |
| Domain types | TypeScript interfaces mirroring API/DB shapes | `agrodroid/web/src/types/models.ts` |

## Pattern Overview

**Overall:** Classic 3-tier REST architecture — Router → Controller → Service → raw SQL, consumed by a separate React SPA. No ORM; no ID base classes; each resource follows the identical route/controller/service triad independently (not a generic CRUD framework, just copy-pasted per resource).

**Key Characteristics:**
- One file per resource per layer (routes/controllers/services), named `<resource>.routes.js` / `.controller.js` / `.service.js` — 10 resources total (alerta, auth, deteccion, dron, empresa, imagen, lectura, notificacion, sensor, umbral, usuario, vinedo).
- No models/entities layer — services query Postgres directly with template-literal SQL and return raw rows.
- Stateless JWT auth; no session store, no refresh tokens.
- Frontend has no dedicated API client abstraction beyond `agrodroid/web/src/services/api.ts` (currently effectively empty/unused — most components call `fetch` directly, see `App.tsx`).
- Frontend state lives entirely in `App.tsx` (lifted state passed down via props), no Redux/Context/Zustand.

## Layers

**Routes:**
- Purpose: Map HTTP verb + path to controller function; attach auth middleware per-route.
- Location: `agrodroid/app/routes/`
- Contains: Thin `express.Router()` wiring only, no logic.
- Depends on: `controllers/`, `middlewares/auth.middleware.js`
- Used by: `agrodroid/app/server.js` (mounted with `app.use("/<resource>", ...)`)

**Controllers:**
- Purpose: Translate HTTP request/response to/from service calls; try/catch → status codes.
- Location: `agrodroid/app/controllers/`
- Contains: Async functions per action (e.g. `listar`, `obtener`, `crear`, `actualizar`, `register`, `login`).
- Depends on: `services/`
- Used by: `routes/`

**Services:**
- Purpose: Business logic and direct SQL access via the shared `pg.Pool`.
- Location: `agrodroid/app/services/`
- Contains: Async functions running parametrized SQL queries (`pool.query(...)`).
- Depends on: `config/db.js`, `bcrypt`, `jsonwebtoken`
- Used by: `controllers/`

**Config:**
- Purpose: Central DB connection pool built from `process.env`.
- Location: `agrodroid/app/config/db.js`
- Contains: Single `pg.Pool` instance, exported as module default.
- Depends on: env vars `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT` (set in `docker-compose.yml`)
- Used by: every `*.service.js`

**Frontend App Shell:**
- Purpose: Routing table + all top-level data fetching/state.
- Location: `agrodroid/web/src/App.tsx`
- Contains: `<BrowserRouter>` with public (`/`, `/login`, `/register`) and nested authenticated (`/dashboard/*`) routes; `useEffect` fetches for vinedos/sensores/alertas/notificaciones.
- Depends on: `pages/Auth/*`, `pages/Usuario/*`, `types/models.ts`
- Used by: `agrodroid/web/src/main.tsx` (entry point)

**Frontend Views:**
- Purpose: Render one domain screen each, purely presentational + local UI state.
- Location: `agrodroid/web/src/pages/Usuario/`
- Contains: `DashboardView`, `SensorMapView` (Leaflet), `SensorReadingsView` (Recharts), `DronesView`, `DiseaseDetectionView`, `AlertsNotificationView`.
- Depends on: props from `App.tsx`, `components/`, `styles/Usuario/*.css`
- Used by: nested `<Route>` elements inside `AppLayout`

## Data Flow

### Primary Request Path (authenticated resource fetch, e.g. Alertas)

1. Frontend fetch with `Authorization: Bearer <token>` header (`agrodroid/web/src/App.tsx:105-117`)
2. Express route matches `/alertas` → `verificarToken` middleware validates JWT, sets `req.usuario` (`agrodroid/app/middlewares/auth.middleware.js:6-33`)
3. `controller.listarAlertas` invoked (`agrodroid/app/routes/alerta.routes.js:8`) → calls `alerta.service.js` → `pool.query(...)`
4. JSON rows returned straight to client; React maps snake_case Postgres columns → camelCase view model in `useEffect` (`agrodroid/web/src/App.tsx:107-116`)

### Auth Flow (Login)

1. `Login.tsx` posts credentials to `POST /auth/login` (`agrodroid/app/routes/auth.routes.js:8`)
2. `auth.controller.js:login` → `auth.service.js:login` — looks up user by `correo`, `bcrypt.compare` against stored hash (`agrodroid/app/services/auth.service.js:54-98`)
3. On success, `jwt.sign` issues a 2h token using hardcoded `SECRET_KEY = "AgroDroid_2026"` (note: this differs from the `JWT_SECRET` env var defined in `docker-compose.yml`, which is never read by the code — env var is effectively dead)
4. Client stores `token` and `usuario` in `localStorage`; used for all subsequent authenticated fetches.

**State Management:**
- Backend: stateless per-request; no server-side session.
- Frontend: all cross-view state lifted into `App.tsx` component state (`useState`/`useEffect`/`useMemo`), passed down as props through `AppLayout` → view components. Auth identity persisted client-side in `localStorage` (`usuario`, `token`).

## Key Abstractions

**Resource triad (routes/controller/service):**
- Purpose: Repeated per-domain-object pattern giving CRUD-ish endpoints.
- Examples: `agrodroid/app/routes/dron.routes.js`, `agrodroid/app/controllers/dron.controller.js`, `agrodroid/app/services/dron.service.js`
- Pattern: Router declares path + middleware → controller wraps service call in try/catch → service runs SQL and returns rows.

**verificarToken middleware:**
- Purpose: Single reusable auth gate applied selectively per-route (not globally).
- Examples: `agrodroid/app/middlewares/auth.middleware.js`, used inline in almost every `*.routes.js`
- Pattern: Express middleware function reading `Authorization` header, decoding JWT, attaching `req.usuario`.

**Domain type models (frontend):**
- Purpose: TypeScript contracts for `Usuario`, `Empresa`, `Vinedo`, `Sensor`, `LecturaSensor`, `Dron`, `DeteccionEnfermedad`, `Alerta`, `Notificacion`.
- Examples: `agrodroid/web/src/types/models.ts`
- Pattern: Plain interfaces; components accept typed props built from these.

## Entry Points

**API Server:**
- Location: `agrodroid/app/server.js`
- Triggers: `npm start` (`node server.js`) or docker-compose `app` service build (`agrodroid/app/dockerfile`)
- Responsibilities: Wire CORS/JSON middleware, mount all 11 routers, listen on port 3000.

**Frontend App:**
- Location: `agrodroid/web/src/main.tsx` → `agrodroid/web/src/App.tsx`
- Triggers: `npm run dev` (Vite) or built static bundle (`npm run build`)
- Responsibilities: Mount React root, set up router, fetch initial data.

**Database Init:**
- Location: `agrodroid/db/init.sql`
- Triggers: Automatically executed by Postgres container on first startup via `docker-entrypoint-initdb.d` volume mount in `docker-compose.yml`
- Responsibilities: Create all tables and seed/reference data (14 `CREATE TABLE` statements).

## Architectural Constraints

- **Threading:** Single-threaded Node event loop (standard Express); no worker threads or clustering configured.
- **Global state:** Single shared `pg.Pool` singleton in `agrodroid/app/config/db.js`, imported by every service file — connection pooling is implicit and unconfigured (defaults).
- **Circular imports:** None observed — strict one-directional layering (routes → controllers → services → config).
- **Hardcoded secrets:** JWT secret is hardcoded as a literal string in both `agrodroid/app/services/auth.service.js:53` and `agrodroid/app/middlewares/auth.middleware.js:4`, duplicated rather than shared, and does not use the `JWT_SECRET` env var already defined in `docker-compose.yml`.
- **No shared API client:** Frontend has `agrodroid/web/src/services/api.ts` present but effectively unused; most data fetching is inlined directly in `App.tsx` with hardcoded `http://localhost:3000` base URL, meaning environment-specific API URLs are not configurable without code changes.
- **Stray build artifacts:** Zip files present in the source tree (`agrodroid/app/routes/routes.zip`, `agrodroid/app/controllers/controllers.zip`, `agrodroid/app/services/services.zip`) — likely leftover archives, not part of the runtime.

## Anti-Patterns

### Duplicated hardcoded JWT secret

**What happens:** The string `"AgroDroid_2026"` is defined independently in `agrodroid/app/services/auth.service.js:53` and `agrodroid/app/middlewares/auth.middleware.js:4`, instead of being read from `process.env.JWT_SECRET` (already provisioned in `docker-compose.yml`).
**Why it's wrong:** Secret is committed to source control, cannot be rotated without a code deploy, and the two definitions could silently drift out of sync.
**Do this instead:** Read a single `JWT_SECRET` from `agrodroid/app/config/db.js`-style config module or `process.env.JWT_SECRET` directly in both files.

### Frontend fetches hardcoded to localhost

**What happens:** `const API = "http://localhost:3000";` is defined inline in `agrodroid/web/src/App.tsx:63` and reused for every fetch call in that file.
**Why it's wrong:** Any non-local deployment (staging/production) requires editing source code; no `.env`/Vite env var is used despite Vite supporting `import.meta.env`.
**Do this instead:** Centralize the base URL in `agrodroid/web/src/services/api.ts` (currently unused) and source it from a Vite env variable (e.g. `VITE_API_URL`).

## Error Handling

**Strategy:** Try/catch at the controller layer only; services throw plain `Error` objects with user-facing Spanish messages (e.g. `"El correo ya está registrado"`).

**Patterns:**
- Controllers catch and map to HTTP status: 500 for generic failures, 401 for auth failures (`agrodroid/app/controllers/auth.controller.js:14-21,32-39`).
- No centralized Express error-handling middleware; each controller replicates its own try/catch block.
- No structured/logged error format — `console.error(error)` only.

## Cross-Cutting Concerns

**Logging:** `console.log`/`console.error` only, no logging library, no request logging middleware (e.g. morgan) configured in `server.js`.
**Validation:** No request validation library (e.g. joi/zod); controllers pass `req.body` straight through to services, which assume well-formed shape.
**Authentication:** JWT-based, verified per-route via `verificarToken` middleware; not applied globally (e.g. `POST /empresas` in `agrodroid/app/routes/empresa.routes.js:9` omits it while `GET`/`PUT` on the same resource require it — inconsistent coverage).

---

*Architecture analysis: 2026-07-05*
