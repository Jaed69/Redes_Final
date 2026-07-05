# Codebase Structure

**Analysis Date:** 2026-07-05

## Directory Layout

```
Redes_Final/                       # repo root
├── .agents/                       # GSD/agent tooling config (not app code)
├── .planning/                     # GSD planning docs (this analysis lives here)
└── agrodroid/                     # main application monorepo-style folder
    ├── docker-compose.yml         # orchestrates db + app services
    ├── app/                       # Node/Express REST API
    │   ├── server.js              # entry point — mounts routers, starts listener
    │   ├── dockerfile             # container build for the API
    │   ├── package.json           # deps: express, pg, bcrypt, jsonwebtoken, cors
    │   ├── config/
    │   │   └── db.js              # shared pg.Pool, reads DB_* env vars
    │   ├── routes/                # one <resource>.routes.js per domain resource
    │   ├── controllers/           # one <resource>.controller.js per domain resource
    │   ├── services/              # one <resource>.service.js per domain resource (SQL)
    │   └── middlewares/
    │       └── auth.middleware.js # verificarToken JWT guard
    ├── db/
    │   └── init.sql               # schema + seed, mounted into Postgres container
    └── web/                       # React + TypeScript + Vite SPA
        ├── package.json           # deps: react 19, react-router-dom 7, leaflet, recharts
        ├── public/                # static assets served as-is
        └── src/
            ├── main.tsx           # React root mount
            ├── App.tsx            # router + top-level data fetching/state
            ├── App.css / index.css
            ├── assets/            # images (hero.png, react.svg, vite.svg)
            ├── components/        # shared, prop-driven UI (Navbar, Sidebar, StatCard, DataReadOut)
            ├── pages/
            │   ├── Auth/          # Login.tsx, Register.tsx (public routes)
            │   ├── UserDashboard.tsx
            │   └── Usuario/       # Applayout.tsx + one view per feature
            ├── services/
            │   └── api.ts         # intended API client (currently unused/empty)
            ├── styles/
            │   ├── Auth/          # Login.css, Register.css
            │   ├── Usuario/       # per-view + shared.css + theme.css
            │   └── UserDashboard.css
            └── types/
                └── models.ts      # TS interfaces for all domain entities
```

## Directory Purposes

**`agrodroid/app/routes/`:**
- Purpose: Declare HTTP endpoints and wire middleware per resource.
- Contains: `alerta.routes.js`, `auth.routes.js`, `deteccion.routes.js`, `dron.routes.js`, `empresa.routes.js`, `imagen.routes.js`, `lectura.routes.js`, `notificacion.routes.js`, `sensor.routes.js`, `umbral.routes.js`, `usuario.routes.js`, `vinedo.routes.js`.
- Key files: `auth.routes.js` (public: register/login), all others require `verificarToken` on most/all routes.
- Note: `routes.zip` present here (`agrodroid/app/routes/routes.zip`) — stray archive, not required at runtime.

**`agrodroid/app/controllers/`:**
- Purpose: HTTP-facing handlers; one function per action, per resource.
- Contains: matches the routes list 1:1 (`<resource>.controller.js`).
- Note: `controllers.zip` present — stray archive.

**`agrodroid/app/services/`:**
- Purpose: Business logic + direct Postgres access via `pg.Pool`.
- Contains: matches controllers 1:1 (`<resource>.service.js`).
- Note: `services.zip` present — stray archive.

**`agrodroid/app/config/`:**
- Purpose: Shared infrastructure config.
- Contains: `db.js` only (Postgres connection pool).

**`agrodroid/app/middlewares/`:**
- Purpose: Cross-cutting request handling.
- Contains: `auth.middleware.js` (JWT verification) — only middleware in the project.

**`agrodroid/db/`:**
- Purpose: Database schema/seed definition consumed by Docker at first container boot.
- Contains: `init.sql` (14 tables).

**`agrodroid/web/src/pages/Auth/`:**
- Purpose: Unauthenticated entry screens.
- Contains: `Login.tsx`, `Register.tsx`.

**`agrodroid/web/src/pages/Usuario/`:**
- Purpose: Authenticated app screens, rendered inside `Applayout.tsx` via `<Outlet/>`.
- Contains: `Applayout.tsx` (shell), `DashboardView.tsx`, `SensorMapView.tsx` (Leaflet map), `SensorReadingsView.tsx` (Recharts), `DronesView.tsx`, `DiseaseDetectionView.tsx`, `AlertsNotificationView.tsx`.

**`agrodroid/web/src/components/`:**
- Purpose: Reusable presentational pieces shared across views.
- Contains: `navbar.tsx` (lowercase — see naming note below), `Sidebar.tsx`, `StatCard.tsx`, `DataReadOut.tsx`.

**`agrodroid/web/src/services/`:**
- Purpose: Intended location for API client abstraction.
- Contains: `api.ts` — currently not used by `App.tsx` (which fetches directly); treat as the place to add a real API client.

**`agrodroid/web/src/styles/`:**
- Purpose: Per-view/per-feature CSS, mirrors the `pages/` structure (`Auth/`, `Usuario/`).
- Contains: `theme.css` and `shared.css` for cross-view tokens/utilities under `Usuario/`.

**`agrodroid/web/src/types/`:**
- Purpose: Single source of truth for domain TypeScript interfaces.
- Contains: `models.ts` — `Usuario`, `Empresa`, `Vinedo`, `Sensor`, `LecturaSensor`, `Dron`, `DeteccionEnfermedad`, `Alerta`, `Notificacion`.

## Key File Locations

**Entry Points:**
- `agrodroid/app/server.js`: API bootstrap, router mounting, port 3000 listener.
- `agrodroid/web/src/main.tsx`: React root mount.
- `agrodroid/web/src/App.tsx`: Route table + all initial data fetching.

**Configuration:**
- `agrodroid/docker-compose.yml`: service definitions, env vars (`DB_*`, `JWT_SECRET` — note `JWT_SECRET` is defined but unused by code).
- `agrodroid/app/config/db.js`: Postgres pool.
- `agrodroid/app/dockerfile`: API container build.

**Core Logic:**
- `agrodroid/app/controllers/*.controller.js` + `agrodroid/app/services/*.service.js`: all business logic.
- `agrodroid/app/middlewares/auth.middleware.js`: auth gate.

**Testing:**
- Not detected — no test files, test runner config, or `test`/`__tests__` directories found anywhere in `agrodroid/`.

## Naming Conventions

**Files (backend, `agrodroid/app/`):**
- Pattern: `<resource-in-spanish>.<layer>.js`, all lowercase, singular Spanish nouns.
- Example: `vinedo.routes.js`, `vinedo.controller.js`, `vinedo.service.js` (vineyard); `dron.*.js`, `sensor.*.js`, `alerta.*.js`.

**Files (frontend, `agrodroid/web/src/`):**
- Pattern: PascalCase for React components/views (`DashboardView.tsx`, `SensorMapView.tsx`, `StatCard.tsx`), camelCase for non-component modules (`api.ts`, `models.ts`).
- Inconsistency: `components/navbar.tsx` is lowercase while every other component file (`Sidebar.tsx`, `StatCard.tsx`, `DataReadOut.tsx`) is PascalCase, and `Applayout.tsx` uses inconsistent internal casing (`App` + lowercase `layout` — should be `AppLayout.tsx` per its own exported symbol `AppLayout`).

**Directories:**
- Backend: plural, lowercase, functional (`routes/`, `controllers/`, `services/`, `middlewares/`, `config/`).
- Frontend: PascalCase for feature-grouping page directories (`pages/Auth/`, `pages/Usuario/`, `styles/Auth/`, `styles/Usuario/`), lowercase for generic dirs (`components/`, `services/`, `types/`, `styles/`, `assets/`).

**Functions (backend):**
- Spanish verb-based, e.g. `listar`, `obtener`, `crear`, `actualizar`, `eliminar`, or resource-suffixed variants (`listarAlertas`, `crearDron`, `actualizarEstado`).

## Where to Add New Code

**New backend resource (e.g. "cultivo"):**
- Route: `agrodroid/app/routes/cultivo.routes.js` (follow existing router pattern, attach `verificarToken` as needed)
- Controller: `agrodroid/app/controllers/cultivo.controller.js`
- Service: `agrodroid/app/services/cultivo.service.js`
- Mount in: `agrodroid/app/server.js` (`require` + `app.use("/cultivos", cultivoRoutes)`)
- Schema: add `CREATE TABLE` to `agrodroid/db/init.sql`

**New frontend feature view:**
- Component: `agrodroid/web/src/pages/Usuario/<Feature>View.tsx`
- Styles: `agrodroid/web/src/styles/Usuario/<Feature>View.css`
- Route: add `<Route path="..." element={<...View .../>} />` inside the authenticated block in `agrodroid/web/src/App.tsx`
- Types: extend `agrodroid/web/src/types/models.ts` if new domain shape is introduced
- Data fetching: add a `useEffect` fetch block in `App.tsx` (current convention) or, preferably, extend `agrodroid/web/src/services/api.ts` to centralize it.

**Shared frontend UI:**
- Location: `agrodroid/web/src/components/` (PascalCase filename to match existing convention, except the pre-existing `navbar.tsx` outlier).

**Backend cross-cutting logic (new middleware):**
- Location: `agrodroid/app/middlewares/<name>.middleware.js`, required directly inside relevant `*.routes.js` files (no central middleware registry exists).

## Special Directories

**`agrodroid/app/node_modules/`:**
- Purpose: npm dependencies for the API.
- Generated: Yes
- Committed: Not verified — should be gitignored; do not analyze/edit.

**`agrodroid/web/public/`:**
- Purpose: Static assets served unprocessed by Vite.
- Generated: No
- Committed: Yes

**Stray `.zip` archives (`agrodroid/app/{routes,controllers,services}/*.zip`):**
- Purpose: Unknown/legacy — appear to be backup snapshots of those directories.
- Generated: Unclear
- Committed: Yes (present in working tree) — recommend removing or relocating out of source directories since they are not required by `server.js` or `package.json`.

---

*Structure analysis: 2026-07-05*
