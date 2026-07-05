<!-- refreshed: 2026-07-05 -->
# Architecture

**Analysis Date:** 2026-07-05

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     React SPA (web/)                         │
├──────────────────────────┬───────────────────────────────────┤
│  Operator App            │  Admin Panel (NEW)                │
│  `web/src/pages/Usuario` │  `web/src/pages/Admin`             │
│  fetches real API        │  reads/writes `mockData.ts` only  │
└────────────┬──────────────┴───────────┬───────────────────────┘
             │ fetch(`http://localhost:3000/...`)  │ (no network calls)
             ▼                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Express API (app/, port 3000)                 │
│  `app/server.js` → routes → controllers → services           │
└────────────┬───────────────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL (db/init.sql)                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App shell / router | Top-level route table, auth/session bootstrap, data fetching for operator views | `agrodroid/web/src/App.tsx` |
| Operator layout | Sidebar/navbar shell for logged-in field-user routes | `agrodroid/web/src/pages/Usuario/Applayout.tsx` |
| Admin layout | Sidebar/navbar shell for `/admin/*` routes, reuses operator's `.app-shell` CSS | `agrodroid/web/src/pages/Admin/AdminLayout.tsx` |
| Admin views (CRUD) | Per-entity CRUD screens (Empresa, Vinedo, Sensor, Dron, Umbral, Usuario) — currently mock-data-backed | `agrodroid/web/src/pages/Admin/*.tsx` |
| Admin dashboard | Aggregate stat cards computed from mock arrays | `agrodroid/web/src/pages/Admin/AdminDashboard.tsx` |
| Shared admin widgets | Generic table, modal shell, delete-confirmation dialog | `agrodroid/web/src/components/DataTable.tsx`, `Modal.tsx`, `ConfirmDialog.tsx` |
| Entity edit forms | One modal-form component per admin entity | `agrodroid/web/src/modals/*.tsx` |
| Mock data source | In-memory fixture arrays typed against admin models, doc comment says "replace with real fetch when connecting API" | `agrodroid/web/src/mockData.ts` |
| API client | Placeholder — file exists but is currently empty | `agrodroid/web/src/services/api.ts` |
| Express entry | Registers all route modules, starts HTTP server on :3000 | `agrodroid/app/server.js` |
| Routes → Controllers → Services | Standard 3-tier Express layering, one triplet per resource | `agrodroid/app/routes/*.js`, `agrodroid/app/controllers/*.js`, `agrodroid/app/services/*.js` |
| DB schema | Postgres schema/seed loaded by container init | `agrodroid/db/init.sql` |
| Auth middleware | JWT verification for protected routes | `agrodroid/app/middlewares/auth.middleware.js` |

## Pattern Overview

**Overall:** Two independent frontend sub-apps (Operator "Usuario" flow, Admin flow) sharing one React Router tree, one CSS shell (`app-shell`), and one component library, backed by a single Express + Postgres REST API. **The Admin sub-app is not yet wired to that API** — it is a self-contained CRUD prototype running entirely on local component state seeded from `mockData.ts`.

**Key Characteristics:**
- Operator views (`pages/Usuario/*`) get their data from `App.tsx`'s `useEffect` `fetch()` calls against `http://localhost:3000`.
- Admin views (`pages/Admin/*`) each call `useState<XAdmin[]>(xMock)` directly from `mockData.ts` — no `fetch`, no `services/api.ts` usage. Create/Update/Delete are pure client-side array mutations (`setEmpresas(prev => ...)`), lost on refresh.
- `agrodroid/web/src/services/api.ts` exists as a stub (empty file) — the intended integration point for wiring Admin to the real backend, not yet implemented.
- Types for the Admin domain live in `agrodroid/web/src/types/models.ts` as `*Admin` interfaces (e.g. `EmpresaAdmin`, `VinedoAdmin`), separate from the operator-facing types (`Empresa`, `Vinedo`, etc.) used by `App.tsx`. Field shapes overlap but are declared independently.
- Backend (`agrodroid/app/`) is unaware of the Admin panel; it exposes the same REST resources (`/empresas`, `/vinedos`, `/sensores`, `/drones`, `/umbrales`, `/usuarios`) that the Admin panel *could* consume but currently doesn't call.

## Layers

**Presentation — Operator (`agrodroid/web/src/pages/Usuario/`):**
- Purpose: field-operator dashboard, sensor map, readings, drones, disease detection, alerts.
- Depends on: state/handlers passed down from `App.tsx`.
- Data source: real API via `fetch`.

**Presentation — Admin (`agrodroid/web/src/pages/Admin/`):**
- Purpose: back-office CRUD for Empresa, Vinedo, Sensor, Dron, Umbral, Usuario, plus a stats dashboard.
- Location: `AdminDashboard.tsx`, `EmpresaView.tsx`, `VinedoView.tsx`, `SensorView.tsx`, `DronView.tsx`, `UmbralView.tsx`, `UsuarioView.tsx`, `AdminLayout.tsx`.
- Contains: one `useState` array of `*Admin[]` per view, initialized from `mockData.ts`; modal-driven create/edit; `ConfirmDialog` for delete.
- Depends on: `mockData.ts`, `components/DataTable.tsx`, `components/Modal.tsx`, `components/ConfirmDialog.tsx`, `modals/*Modal.tsx`, `types/models.ts`.
- Used by: routed under `/admin/*` in `App.tsx`.
- **Not yet connected to:** `services/api.ts` or the Express backend.

**Shared UI Components (`agrodroid/web/src/components/`):**
- `DataTable.tsx` — generic typed table (`T extends { id: string }`), column-driven, used by every Admin view.
- `Modal.tsx` — generic modal shell (open/title/onClose/children/widthPx), used to host each entity's form.
- `ConfirmDialog.tsx` — generic yes/no confirmation, used for delete actions.
- `AdminNavbar.tsx` / `AdminSidebar.tsx` — Admin-specific chrome, parallel to operator's `navbar.tsx` / `Sidebar.tsx`.

**Modal Forms (`agrodroid/web/src/modals/`):**
- One form component per admin entity: `EmpresaModal.tsx`, `VinedoModal.tsx`, `SensorModal.tsx`, `DronModal.tsx`, `UmbralModal.tsx`, `UsuarioModal.tsx`.
- Pattern: controlled form fields, `onGuardar`/`onCerrar`-style callbacks handed in from the parent view; view owns the array mutation, modal only edits a draft object.

**Mock Data (`agrodroid/web/src/mockData.ts`):**
- Purpose: fixture arrays (`empresasMock`, `vinedosMock`, `sensoresMock`, `dronesMock`, `umbralesMock`, `usuariosMock`) typed against `*Admin` interfaces in `types/models.ts`.
- Explicit doc comment in the file states it should be replaced by real API calls "when connecting" — confirms this is a known temporary state, not an oversight.

**API Layer (`agrodroid/app/`):**
- Purpose: Express REST API — one routes/controllers/services triplet per resource.
- Entry: `agrodroid/app/server.js` mounts all route modules under path prefixes matching resource names (`/empresas`, `/vinedos`, `/sensores`, `/drones`, `/alertas`, `/notificaciones`, `/usuarios`, `/imagenes`, `/detecciones`, `/lecturas`, `/umbrales`, `/auth`).
- Depends on: `agrodroid/app/config/db.js` (Postgres pool), `agrodroid/app/middlewares/auth.middleware.js` (JWT).

**Data Store (`agrodroid/db/init.sql`):**
- Postgres schema and seed data, loaded automatically by the `db` container via `docker-entrypoint-initdb.d`.

## Data Flow

### Operator Request Path (real API)

1. `App.tsx` mounts, runs `useEffect` fetches to `http://localhost:3000/vinedos`, `/sensores`, `/alertas`, `/notificaciones` (`agrodroid/web/src/App.tsx:88-150`).
2. Raw snake_case API rows are mapped into camelCase view models inline in each `.then()`.
3. State flows down as props into `AppLayout` → route-specific views (`DashboardView`, `SensorMapView`, etc.).
4. Express routes (`agrodroid/app/routes/*.js`) dispatch to controllers, which call services, which query Postgres via `config/db.js`.

### Admin CRUD Path (mock-only, NOT wired to API)

1. Admin view mounts (e.g. `EmpresaView.tsx`), initializes `useState(empresasMock)` from `agrodroid/web/src/mockData.ts`.
2. User opens `Modal` with an `EmpresaModal` form to create/edit a row, or `ConfirmDialog` to delete.
3. On save, the view's own setter (`setEmpresas`) mutates the local array — no HTTP request is made, nothing persists past a page refresh, and the Express `/empresas` endpoint is never called from this flow.
4. `AdminDashboard.tsx` separately imports the same mock arrays directly to compute stat-card totals (`agrodroid/web/src/pages/Admin/AdminDashboard.tsx:2`).

**State Management:**
- No global store (no Redux/Zustand/Context for domain data) — state lives in `App.tsx` (operator) or per-view `useState` (admin), passed down via props.
- Auth/session state is read ad hoc from `localStorage` (`usuario`, `token`) in `App.tsx`, not centralized.

## Key Abstractions

**`*Admin` type family:**
- Purpose: admin-panel-specific view models (`EmpresaAdmin`, `VinedoAdmin`, `SensorAdmin`, `DronAdmin`, `UmbralAdmin`, `UsuarioAdmin`), separate from operator-facing types (`Empresa`, `Vinedo`, `Sensor`, `Dron`).
- Examples: `agrodroid/web/src/types/models.ts`, consumed by `agrodroid/web/src/mockData.ts` and every `pages/Admin/*View.tsx`.
- Pattern: flat interfaces with an `id: string` field satisfying `DataTable<T extends { id: string }>`'s generic constraint.

**Generic `DataTable<T>`:**
- Purpose: single reusable table component driven by a `DataTableColumn<T>[]` config, used identically across all six Admin entity views.
- Examples: `agrodroid/web/src/components/DataTable.tsx`.

**Modal + ConfirmDialog pair:**
- Purpose: consistent create/edit (`Modal` + entity-specific form) and delete (`ConfirmDialog`) UX across all Admin views.
- Examples: `agrodroid/web/src/components/Modal.tsx`, `agrodroid/web/src/components/ConfirmDialog.tsx`.

## Entry Points

**Frontend SPA:**
- Location: `agrodroid/web/src/main.tsx` → `agrodroid/web/src/App.tsx`
- Triggers: Vite dev server (`npm run dev`) or built bundle served statically
- Responsibilities: route table (public auth routes, `/dashboard/*` operator routes, `/admin/*` admin routes), operator data fetching

**Backend API:**
- Location: `agrodroid/app/server.js`
- Triggers: `npm start` inside the `app` container, listens on port 3000
- Responsibilities: mounts all resource route modules, applies `cors()` and `express.json()` globally

## Architectural Constraints

- **Frontend/backend integration gap:** the entire Admin panel (`pages/Admin/*`, `modals/*`) is built against `mockData.ts`, not the live API. Any phase that "completes" the Admin panel must wire each view to `services/api.ts` (currently empty) and the matching Express endpoints (`/empresas`, `/vinedos`, `/sensores`, `/drones`, `/umbrales`, `/usuarios`).
- **Duplicate type universes:** operator types (`Empresa`, `Vinedo`, `Sensor`, `Dron`) and admin types (`EmpresaAdmin`, `VinedoAdmin`, `SensorAdmin`, `DronAdmin`) both live in `types/models.ts` and describe overlapping domain concepts independently — reconciling them is required before Admin can consume the same `/vinedos` etc. responses that operator views already parse.
- **No shared HTTP client:** operator code calls `fetch` directly with a hardcoded `API = "http://localhost:3000"` constant inside `App.tsx`; there is no shared axios/fetch wrapper. `services/api.ts` is the presumed intended location but is empty.
- **Global state:** none beyond `localStorage` reads for `usuario`/`token` in `App.tsx`; each Admin view holds independent local `useState`, so data is not shared between the Admin dashboard's stat cards and any given entity view (both re-derive from the same static `mockData.ts` module-level constants, so they stay visually consistent only because the source is static).
- **docker-compose.yml indentation bug:** the `web` service block in `agrodroid/docker-compose.yml` is not indented under `services:` (it is at document root, sibling to `services:`), so `docker compose up` will not build/start the `web` container as currently written. This must be fixed before the new `agrodroid/web/dockerfile` takes effect.

## Anti-Patterns

### Mock-data-as-state-source in production-shaped components

**What happens:** Every Admin view calls `useState<XAdmin[]>(xMock)` directly against the imported mock array from `mockData.ts`, and all CRUD operations mutate only that in-memory array.
**Why it's wrong:** Data does not persist, is not shared across browser tabs/sessions, and diverges silently from what the real `/empresas`, `/vinedos`, etc. endpoints will return once wired up.
**Do this instead:** Replace the `useState(xMock)` initializer with a `useEffect` fetch to `services/api.ts` (mirroring the pattern already used in `App.tsx` for operator views), keep `mockData.ts` only as a fallback/dev fixture behind an explicit flag if needed.

### Two parallel type hierarchies for the same domain concepts

**What happens:** `Vinedo` (operator) and `VinedoAdmin` (admin) are declared as separate, structurally-similar interfaces in `agrodroid/web/src/types/models.ts`.
**Why it's wrong:** Any future integration work has to map between two shapes for what is the same backend resource, doubling mapping logic and inviting drift.
**Do this instead:** Consolidate into one canonical type per resource (or a base type with an admin-only extension), used by both operator fetch-mapping code in `App.tsx` and Admin views.

## Error Handling

**Strategy:** Minimal — no visible try/catch around the operator `fetch().then()` chains in `App.tsx`, no error boundaries observed in the SPA. Admin panel has no error paths at all since it performs no I/O.

**Patterns:**
- Operator fetches assume success; failures are unhandled at the call site.
- Backend controllers (`agrodroid/app/controllers/*.js`) are the presumed location for request-level error handling; each resource has one controller.

## Cross-Cutting Concerns

**Logging:** `console.log("Servidor corriendo en puerto 3000")` only, in `agrodroid/app/server.js`. No structured logging observed anywhere.
**Validation:** Not evident in Admin modal forms (no schema library imported: no zod/yup usage found). Backend validation lives (if present) inside individual controllers.
**Authentication:** JWT-based, token read from `localStorage` and sent as `Authorization: Bearer` header for a subset of operator fetches (`/alertas`, `/notificaciones`) in `App.tsx`; enforced server-side by `agrodroid/app/middlewares/auth.middleware.js`. Admin panel routes are not gated by any auth check in `App.tsx`'s router — `/admin/*` is reachable without a role check.

---

*Architecture analysis: 2026-07-05*
