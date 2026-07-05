# Codebase Structure

**Analysis Date:** 2026-07-05

## Directory Layout

```
agrodroid/
├── app/                          # Express + Node REST API
│   ├── config/db.js              # Postgres pool config
│   ├── controllers/*.controller.js
│   ├── services/*.service.js
│   ├── routes/*.routes.js
│   ├── middlewares/auth.middleware.js
│   ├── server.js                 # API entry point (port 3000)
│   ├── package.json
│   └── dockerfile
├── db/
│   └── init.sql                  # Postgres schema + seed
├── docker-compose.yml            # Orchestrates db, app, web (web block has an indentation bug — see ARCHITECTURE.md)
└── web/                          # React + Vite + TypeScript SPA
    ├── dockerfile                # NEW — node:20 dev-server image, `npm run dev -- --host 0.0.0.0`, exposes 5173
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.tsx               # React root
        ├── App.tsx                # Route table + operator data fetching
        ├── App.css / index.css
        ├── mockData.ts            # NEW — fixture arrays for the Admin panel (empresasMock, vinedosMock, sensoresMock, dronesMock, umbralesMock, usuariosMock)
        ├── types/models.ts        # Operator types (Empresa, Vinedo, Sensor, Dron, ...) + Admin types (EmpresaAdmin, VinedoAdmin, ...)
        ├── services/
        │   └── api.ts             # Placeholder — currently empty, intended home for a shared HTTP client
        ├── components/
        │   ├── navbar.tsx, Sidebar.tsx        # Operator chrome
        │   ├── AdminNavbar.tsx, AdminSidebar.tsx  # NEW — Admin chrome
        │   ├── DataTable.tsx      # NEW — generic typed table shared by all Admin views
        │   ├── Modal.tsx          # NEW — generic modal shell
        │   ├── ConfirmDialog.tsx  # NEW — generic delete-confirmation dialog
        │   ├── StatCard.tsx, DataReadOut.tsx
        ├── modals/                # NEW — one form component per Admin entity
        │   ├── EmpresaModal.tsx
        │   ├── VinedoModal.tsx
        │   ├── SensorModal.tsx
        │   ├── DronModal.tsx
        │   ├── UmbralModal.tsx
        │   └── UsuarioModal.tsx
        ├── pages/
        │   ├── Auth/              # Login.tsx, Register.tsx (public routes)
        │   ├── Usuario/           # Operator app: Applayout, DashboardView, SensorMapView,
        │   │                        SensorReadingsView, DronesView, DiseaseDetectionView,
        │   │                        AlertsNotificationView
        │   ├── UserDashboard.tsx
        │   └── Admin/             # NEW — Admin panel, routed under `/admin/*`
        │       ├── AdminLayout.tsx       # Shell (reuses `.app-shell` CSS from operator)
        │       ├── AdminDashboard.tsx    # Stat cards from mockData
        │       ├── EmpresaView.tsx       # CRUD, reads/writes empresasMock
        │       ├── VinedoView.tsx        # CRUD, reads/writes vinedosMock
        │       ├── SensorView.tsx        # CRUD, reads/writes sensoresMock
        │       ├── DronView.tsx          # CRUD, reads/writes dronesMock
        │       ├── UmbralView.tsx        # CRUD, reads/writes umbralesMock
        │       └── UsuarioView.tsx       # CRUD, reads/writes usuariosMock
        └── styles/
            ├── Usuario/            # Operator CSS (theme.css, Navbar.css, Sidebar.css, ...)
            ├── Auth/               # Login.css, Register.css
            ├── Admin/              # NEW — AdminDashboard.css, Modal.css, Shared.css
            └── UserDashboard.css
```

## Directory Purposes

**`agrodroid/app/`:**
- Purpose: Express REST API serving all domain resources over HTTP on port 3000.
- Contains: one `routes/*.routes.js` + `controllers/*.controller.js` + `services/*.service.js` triplet per resource (alerta, auth, deteccion, dron, empresa, imagen, lectura, notificacion, sensor, umbral, usuario, vinedo).
- Key files: `server.js` (mounts routes), `config/db.js` (Postgres pool), `middlewares/auth.middleware.js` (JWT check), `dockerfile` (node:22-alpine image).

**`agrodroid/db/`:**
- Purpose: database schema and seed data.
- Contains: `init.sql`, auto-loaded by the `db` service's Postgres container via `docker-entrypoint-initdb.d`.

**`agrodroid/web/src/pages/Usuario/`:**
- Purpose: field-operator-facing app screens, fed real data from `App.tsx`'s `fetch()` calls.
- Contains: `Applayout.tsx` (shell), `DashboardView.tsx`, `SensorMapView.tsx`, `SensorReadingsView.tsx`, `DronesView.tsx`, `DiseaseDetectionView.tsx`, `AlertsNotificationView.tsx`.

**`agrodroid/web/src/pages/Admin/` (NEW):**
- Purpose: back-office CRUD screens for administering Empresa/Vinedo/Sensor/Dron/Umbral/Usuario records, plus an aggregate dashboard.
- Contains: `AdminLayout.tsx`, `AdminDashboard.tsx`, `EmpresaView.tsx`, `VinedoView.tsx`, `SensorView.tsx`, `DronView.tsx`, `UmbralView.tsx`, `UsuarioView.tsx`.
- Data source: **`agrodroid/web/src/mockData.ts` only** — none of these views import `services/api.ts` or call `fetch`. Confirmed via import grep: every file in this directory and in `modals/` imports from `../../mockData`.
- Routed at `/admin`, `/admin/empresas`, `/admin/vinedos`, `/admin/usuarios`, `/admin/sensores`, `/admin/drones`, `/admin/umbrales` in `agrodroid/web/src/App.tsx`.

**`agrodroid/web/src/modals/` (NEW):**
- Purpose: create/edit form components, one per Admin entity, opened inside the shared `Modal.tsx` shell.
- Contains: `EmpresaModal.tsx`, `VinedoModal.tsx`, `SensorModal.tsx`, `DronModal.tsx`, `UmbralModal.tsx`, `UsuarioModal.tsx`.

**`agrodroid/web/src/mockData.ts` (NEW):**
- Purpose: static fixture arrays typed against `types/models.ts`'s `*Admin` interfaces, currently the sole data source for the entire Admin panel.
- Generated: No (hand-authored); Committed: Yes.
- Explicit in-file comment flags it as a stand-in for real API calls.

**`agrodroid/web/src/services/`:**
- Purpose: intended home for a shared HTTP client.
- Contains: `api.ts` — present but empty; not yet imported anywhere.

**`agrodroid/web/src/styles/Admin/` (NEW):**
- Purpose: Admin-specific stylesheets.
- Contains: `AdminDashboard.css`, `Modal.css`, `Shared.css`.

## Key File Locations

**Entry Points:**
- `agrodroid/web/src/main.tsx`: React root mount
- `agrodroid/web/src/App.tsx`: route table, operator data fetching
- `agrodroid/app/server.js`: Express API entry, route mounting

**Configuration:**
- `agrodroid/docker-compose.yml`: db/app/web orchestration (web block currently mis-indented — see ARCHITECTURE.md Architectural Constraints)
- `agrodroid/web/dockerfile` (NEW): dev-mode Vite container, `EXPOSE 5173`, `CMD npm run dev -- --host 0.0.0.0`
- `agrodroid/app/dockerfile`: `node:22-alpine`, `EXPOSE 3000`, `CMD npm start`
- `agrodroid/web/vite.config.ts`, `agrodroid/web/tsconfig*.json`, `agrodroid/web/eslint.config.js`

**Core Logic:**
- `agrodroid/app/routes/`, `agrodroid/app/controllers/`, `agrodroid/app/services/`: backend business logic per resource
- `agrodroid/web/src/pages/Usuario/`: operator UI logic
- `agrodroid/web/src/pages/Admin/`: admin UI logic (mock-data-backed)

**Testing:**
- Not detected — no test files or test runner config found in `agrodroid/app/` or `agrodroid/web/`.

## Naming Conventions

**Files:**
- Backend: `<resource>.routes.js`, `<resource>.controller.js`, `<resource>.service.js` (lowercase, dot-suffixed by layer).
- Frontend pages: PascalCase, `<Feature>View.tsx` for content screens (e.g. `EmpresaView.tsx`, `SensorMapView.tsx`), `<Feature>Layout.tsx` for shells.
- Frontend Admin modal forms: `<Entity>Modal.tsx` (e.g. `VinedoModal.tsx`).
- Domain language: Spanish nouns throughout (Empresa, Vinedo, Sensor, Dron, Umbral, Usuario, Alerta, Notificacion), consistent between backend and frontend.

**Types:**
- Operator-facing: bare entity name (`Empresa`, `Vinedo`, `Sensor`, `Dron`).
- Admin-facing: entity name + `Admin` suffix (`EmpresaAdmin`, `VinedoAdmin`, `SensorAdmin`, `DronAdmin`, `UmbralAdmin`, `UsuarioAdmin`), all declared in `agrodroid/web/src/types/models.ts`.

**Directories:**
- Frontend `pages/` split by audience: `Auth/`, `Usuario/`, `Admin/` — mirrored in `styles/Auth/`, `styles/Usuario/`, `styles/Admin/`.

## Where to Add New Code

**New Admin entity view (CRUD):**
- Page: `agrodroid/web/src/pages/Admin/<Entity>View.tsx`, following the `EmpresaView.tsx` pattern (`useState` seeded from a new `mockData.ts` export, `DataTable` + `Modal` + `<Entity>Modal` + `ConfirmDialog`).
- Form: `agrodroid/web/src/modals/<Entity>Modal.tsx`.
- Types: add `<Entity>Admin` interface to `agrodroid/web/src/types/models.ts`.
- Mock fixture: add `<entity>Mock` array to `agrodroid/web/src/mockData.ts` (until API wiring lands).
- Route: register under `/admin/<entities>` inside the `<Route path="/admin" element={<AdminLayout .../>}>` block in `App.tsx`.
- Sidebar link: `agrodroid/web/src/components/AdminSidebar.tsx`.

**Wiring an existing Admin view to the real API (recommended next step):**
- Implement a client in `agrodroid/web/src/services/api.ts` (currently empty).
- Replace `useState(xMock)` in the target `pages/Admin/<Entity>View.tsx` with a `useEffect` fetch, following the mapping pattern already used for operator data in `App.tsx` (`fetch(...).then(r => r.json()).then(data => data.map(...))`).
- Reconcile the `<Entity>Admin` type with the operator `<Entity>` type in `types/models.ts` so both consume the same backend shape.

**New backend resource:**
- Add `agrodroid/app/routes/<resource>.routes.js`, `controllers/<resource>.controller.js`, `services/<resource>.service.js`.
- Mount the route in `agrodroid/app/server.js`.

**Shared Admin UI primitives:**
- Add to `agrodroid/web/src/components/` (e.g. new generic widgets used across multiple Admin views), following `DataTable.tsx` / `Modal.tsx` / `ConfirmDialog.tsx` as the generic-typed-component precedent.

## Special Directories

**`agrodroid/web/src/mockData.ts` (NEW):**
- Purpose: temporary data layer for the entire Admin panel.
- Generated: No; Committed: Yes.
- Note: treat as dev-only fixture; do not extend it as if it were a permanent data source — it is explicitly marked for replacement in its own doc comment.

**`agrodroid/db/init.sql`:**
- Purpose: schema + seed, mounted read-only into the Postgres container at startup.
- Generated: No; Committed: Yes.

---

*Structure analysis: 2026-07-05*
