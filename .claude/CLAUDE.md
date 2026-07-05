<!-- GSD:project-start source:PROJECT.md -->

## Project

**Agrodroid MVP**

Agrodroid es una aplicación web de monitoreo agrícola para viñedos (sensores de campo, drones, detección de enfermedades, alertas) con backend Express/PostgreSQL y frontend React/Vite. El repo también contiene un ejercicio de VLSM/Packet Tracer para el curso de Redes, que es documentación de sustento (informe TB1) y no forma parte del alcance de desarrollo de este proyecto GSD. Este proyecto lleva agrodroid de "CRUD parcialmente conectado + panel admin con datos mock" a un MVP funcional con roles reales, seguridad corregida y monitoreo/gráficos consistentes, para una entrega de curso con fecha cercana.

**Core Value:** Un usuario de cada uno de los 4 perfiles (Admin general, Cliente/productor, Operador/Monitor de campo, TI) puede iniciar sesión y ver/operar exactamente lo que su rol permite, sobre datos reales de la base de datos (no mock), sin huecos de seguridad conocidos.

### Constraints

- **Fecha límite**: Entrega de curso cercana — priorizar MVP mínimo funcional por rol antes que pulido/cobertura exhaustiva.
- **Stack fijo**: Node.js/Express/pg (backend), React 19/Vite/TS (frontend), PostgreSQL 16, Docker Compose — no cambiar de stack, solo corregir y completar.
- **Sin tests existentes**: no hay framework de testing instalado en `app/` ni `web/`; agregar cobertura mínima es discrecional del planner, no bloqueante para el MVP.
- **Seguridad**: JWT secret y credenciales de DB deben salir de texto plano/hardcode antes de considerar el MVP "seguro" (parte explícita del alcance pedido).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Project Shape

## Languages

- JavaScript (CommonJS) - `agrodroid/app/**/*.js` (API backend)
- TypeScript (React/TSX) - `agrodroid/web/src/**/*.tsx`, `*.ts` (frontend)
- SQL (PostgreSQL dialect) - `agrodroid/db/init.sql`
- CSS - `agrodroid/web/src/styles/**/*.css`, `agrodroid/web/src/App.css`, `agrodroid/web/src/index.css`

## Runtime

- Node.js 22 (Alpine) - declared in `agrodroid/app/dockerfile` (`FROM node:22-alpine`)
- No `.nvmrc` or engines field found in either `package.json`
- npm - both `agrodroid/app` and `agrodroid/web` have `package-lock.json` (lockfiles present)

## Frameworks

- Express 4.18.2 - `agrodroid/app/package.json`, entry `agrodroid/app/server.js`
- `pg` 8.16.0 (node-postgres) - PostgreSQL client, `agrodroid/app/config/db.js`
- `bcrypt` 6.0.0 - password hashing, `agrodroid/app/services/auth.service.js`
- `jsonwebtoken` 9.0.3 - JWT auth, `agrodroid/app/services/auth.service.js`, `agrodroid/app/middlewares/auth.middleware.js`
- `cors` 2.8.6 - CORS middleware, `agrodroid/app/server.js`
- React 19.2.7 + React DOM 19.2.7 - `agrodroid/web/package.json`
- React Router DOM 7.18.1 - client-side routing
- Vite 8.1.0 - dev server / build tool, `agrodroid/web/vite.config.ts` (uses `@vitejs/plugin-react`)
- TypeScript ~6.0.2 - `agrodroid/web/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Leaflet 1.9.4 + react-leaflet 5.0.0 - interactive maps (sensor/drone geolocation), `agrodroid/web/src/pages/Usuario/SensorMapView.tsx`
- Recharts 3.9.2 - charts/graphs for sensor readings, `agrodroid/web/src/components/DataReadOut.tsx` area
- None detected in either `agrodroid/app` or `agrodroid/web` (no test framework, no `*.test.*`/`*.spec.*` files, no test script beyond `npm start`)
- Vite (dev server + build) - `agrodroid/web/vite.config.ts`
- ESLint 10.5.0 (flat config) - `agrodroid/web/eslint.config.js`, with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- No linter/formatter configured for `agrodroid/app` (no `.eslintrc`, no Prettier)
- Docker + Docker Compose - `agrodroid/docker-compose.yml`, `agrodroid/app/dockerfile`

## Key Dependencies

- `pg` 8.16.0 - sole data access layer for the API; all controllers/services use raw SQL via `pool.query()` (no ORM), e.g. `agrodroid/app/services/auth.service.js`
- `jsonwebtoken` 9.0.3 - session/auth token issuance and verification
- `bcrypt` 6.0.0 - credential hashing on register/login
- `postgres:16` Docker image - database engine, `agrodroid/docker-compose.yml`
- `node:22-alpine` Docker image - API runtime base image, `agrodroid/app/dockerfile`

## Configuration

- API config is read entirely from process env vars in `agrodroid/app/config/db.js` (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`) — no `.env` file present in the repo; values are injected via `agrodroid/docker-compose.yml` `environment:` block
- **Note:** `docker-compose.yml` hardcodes plaintext credentials (`POSTGRES_PASSWORD: admin123`, `JWT_SECRET: mipalabrasecreta`) directly in the compose file rather than via `.env`/secrets
- `JWT_SECRET` env var is defined in compose but **not actually consumed** — the code hardcodes its own secret string `"AgroDroid_2026"` in both `agrodroid/app/middlewares/auth.middleware.js` and `agrodroid/app/services/auth.service.js` instead of reading `process.env.JWT_SECRET`
- Frontend has no `.env` — API base URL is hardcoded as `"http://localhost:3000"` string literals scattered across `agrodroid/web/src/App.tsx`, `agrodroid/web/src/pages/Auth/Login.tsx`, `agrodroid/web/src/pages/Auth/Register.tsx` (no central config/service; `agrodroid/web/src/services/api.ts` exists but is empty)
- `agrodroid/web/tsconfig.json` (references `tsconfig.app.json`, `tsconfig.node.json`)
- `agrodroid/web/vite.config.ts` - minimal, just the React plugin
- `agrodroid/web/eslint.config.js` - flat ESLint config with TS + React Hooks/Refresh rules

## Platform Requirements

- Node.js 22.x (matches Docker base image) recommended for parity with the container
- PostgreSQL 16 client tooling for direct DB access (or via Docker)
- Docker + Docker Compose for local stack (`docker compose up` from `agrodroid/`)
- No production deployment configuration found (no CI/CD files, no cloud provider configs, no `.env.production`)
- `agrodroid/docker-compose.yml` is dev-oriented (hardcoded credentials, exposed DB port 5432, no volumes for persistence beyond seed script, no health checks/restart policies)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- `<recurso>.controller.js`, `<recurso>.service.js`, `<recurso>.routes.js` — one file per resource, mirrored across three layers. E.g. `usuario.controller.js` / `usuario.service.js` / `usuario.routes.js`.
- Middlewares: `<nombre>.middleware.js` (e.g. `auth.middleware.js`).
- Config: `config/db.js` for the shared `pg` pool.
- Language: all identifiers, comments, and JSON response keys are in **Spanish** (`usuario`, `vinedo`, `sensor`, `mensaje`, `contrasenia`). Keep new backend code in Spanish to match existing resources.
- Components: PascalCase (`StatCard.tsx`, `Sidebar.tsx`) — with one exception, `components/navbar.tsx` is lowercase (inconsistent; follow PascalCase for new components).
- Pages grouped by role/domain folder: `pages/Auth/Login.tsx`, `pages/Usuario/DashboardView.tsx`.
- Styles mirror page/component structure under `styles/`, one `.css` file per component/page (`styles/Usuario/DronesView.css`), plus a shared `styles/Usuario/shared.css` and `styles/Usuario/theme.css` for tokens.
- Types: single central `src/types/models.ts` for all API/domain types (no per-feature type files).
- Backend: verb + noun in Spanish, camelCase — `obtenerUsuarios`, `obtenerUsuarioPorId`, `actualizarUsuario`, `listarUsuarios`. CRUD naming convention: `listar*` (list all), `obtener*` (get one), `crear*`/`registrar*` (create), `actualizar*` (update), `eliminar*` (delete).
- Frontend: `mapX` for API→domain mappers (`mapVinedo`, `mapSensor`, `mapDeteccion`), `calcular*`/`clase*` for derived-value helpers (`calcularEstadoSensor`, `claseEstadoAlerta`).
- Spanish nouns throughout backend (`usuario`, `resultado`, `existe`, `coincide`).
- Database columns are lowercase/no-separator (`idusuario`, `nombreusuario`, `empresa_idempresa`) — this is Postgres' folded identifier style, not a JS convention; controllers/services destructure request bodies in camelCase (`nombreUsuario`, `correo`) even though DB columns are flat-case.
- Two-tier type system, explicitly commented in the file:
- Follow this pattern for any new resource: add `ApiX` (raw), `X` (domain), and `mapX` (converter) to `models.ts` rather than typing components directly from raw API shapes.

## Code Style

- No Prettier config detected in either `agrodroid/app` or `agrodroid/web`. Indentation is 4 spaces in backend JS, 2 spaces in frontend TS/TSX — follow the existing file's indentation when editing.
- Backend style is verbose/spaced: blank lines after `try {`, before `catch`, and around blocks (see `agrodroid/app/controllers/usuario.controller.js`). Not universally consistent — some files (`obtenerUsuario`) are tighter than others (`listarUsuarios`). Match the surrounding function's density rather than imposing one style.
- Backend (`agrodroid/app`): no ESLint config, no lint script in `package.json`.
- Frontend (`agrodroid/web`): ESLint flat config at `agrodroid/web/eslint.config.js` using `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite variant). Run via `npm run lint` in `agrodroid/web`. Ignores `dist/`. Only applies to `**/*.{ts,tsx}`.

## Import Organization

- Order observed: framework (`express`), route/module requires, then local instantiation. E.g. `agrodroid/app/server.js` requires all `./routes/*` before `express()` is instantiated, with `cors` required afterward (inconsistent ordering — no strict convention enforced).
- Controllers `require` their paired service only: `const usuarioService = require("../services/usuario.service")`.
- Routes `require` `express`, the paired controller, and `../middlewares/auth.middleware`.
- Order in `.tsx` files: external packages (`react`, `react-router-dom`) first, then relative CSS import last (`import "../../styles/Auth/Login.css"`). See `agrodroid/web/src/pages/Auth/Login.tsx`.
- No path aliases configured — all imports are relative (`../../styles/...`, `../services/api`).
- `import type { X } from "..."` used for type-only imports (`agrodroid/web/src/components/StatCard.tsx`).

## Error Handling

- Controllers wrap the service call in `try { ... } catch (error) { console.error(error); res.status(...).json({ mensaje: ... }) }`. This pattern is repeated in every controller (`usuario.controller.js`, `auth.controller.js`, etc.) — replicate it exactly for new endpoints.
- Status codes: `500` for unexpected/internal errors, `401` for auth failures (`agrodroid/app/controllers/auth.controller.js` login catch), `404` for not-found (`usuario.controller.js` obtenerUsuario), `400`/`404` per-resource as needed.
- Services throw plain `new Error("mensaje en español")` for business-rule failures (duplicate email, bad credentials — `agrodroid/app/services/auth.service.js`); controllers surface `error.message` directly to the client in the auth flow (`res.status(401).json({ mensaje: error.message })`), but hide internal errors behind generic messages elsewhere (`"Error obteniendo usuarios"`). When writing new services, throw `Error` with a user-facing Spanish message only when it's safe to expose (validation/business errors), not for infra failures.
- No centralized error-handling middleware; every controller function has its own try/catch. No custom error classes.
- `try/catch` around `fetch` calls with `alert(...)` for user-facing errors and `console.error(error)` for diagnostics (`agrodroid/web/src/pages/Auth/Login.tsx`). No toast/notification system — `alert()` is the current mechanism for surfacing frontend errors to users.
- HTTP failures checked via `if (!response.ok)` after parsing JSON, not via `try/catch` on the fetch itself.

## Logging

- Backend: `console.error(error)` inside every catch block before responding with an error JSON.
- Backend: `console.log("Servidor corriendo en puerto 3000")` on startup (`agrodroid/app/server.js`).
- Frontend: `console.log(data)` after successful login (debug leftover in `Login.tsx`) and `console.error(error)` in catch blocks.

## Comments

- Backend: sparse; occasional Spanish inline comments marking sections (`// Comparar contraseña`, `// Generar token` in `auth.service.js`; `// Configuración del puerto` in `server.js`).
- Frontend `models.ts` is the exception — heavily annotated with JSDoc-style block comments explaining data-shape mismatches between the Postgres/Express API and the domain model ("gap 1", "gap 2" markers referencing missing FKs/fields). New type additions to this file should keep documenting such API/domain discrepancies inline.
- Used selectively in `agrodroid/web/src/types/models.ts` to document endpoint origin (`/** POST /auth/login → resultado.usuario (auth.service.js) */`) and known data gaps. Not used elsewhere in the frontend or anywhere in the backend.

## Function Design

## Module Design

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

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

- Operator views (`pages/Usuario/*`) get their data from `App.tsx`'s `useEffect` `fetch()` calls against `http://localhost:3000`.
- Admin views (`pages/Admin/*`) each call `useState<XAdmin[]>(xMock)` directly from `mockData.ts` — no `fetch`, no `services/api.ts` usage. Create/Update/Delete are pure client-side array mutations (`setEmpresas(prev => ...)`), lost on refresh.
- `agrodroid/web/src/services/api.ts` exists as a stub (empty file) — the intended integration point for wiring Admin to the real backend, not yet implemented.
- Types for the Admin domain live in `agrodroid/web/src/types/models.ts` as `*Admin` interfaces (e.g. `EmpresaAdmin`, `VinedoAdmin`), separate from the operator-facing types (`Empresa`, `Vinedo`, etc.) used by `App.tsx`. Field shapes overlap but are declared independently.
- Backend (`agrodroid/app/`) is unaware of the Admin panel; it exposes the same REST resources (`/empresas`, `/vinedos`, `/sensores`, `/drones`, `/umbrales`, `/usuarios`) that the Admin panel *could* consume but currently doesn't call.

## Layers

- Purpose: field-operator dashboard, sensor map, readings, drones, disease detection, alerts.
- Depends on: state/handlers passed down from `App.tsx`.
- Data source: real API via `fetch`.
- Purpose: back-office CRUD for Empresa, Vinedo, Sensor, Dron, Umbral, Usuario, plus a stats dashboard.
- Location: `AdminDashboard.tsx`, `EmpresaView.tsx`, `VinedoView.tsx`, `SensorView.tsx`, `DronView.tsx`, `UmbralView.tsx`, `UsuarioView.tsx`, `AdminLayout.tsx`.
- Contains: one `useState` array of `*Admin[]` per view, initialized from `mockData.ts`; modal-driven create/edit; `ConfirmDialog` for delete.
- Depends on: `mockData.ts`, `components/DataTable.tsx`, `components/Modal.tsx`, `components/ConfirmDialog.tsx`, `modals/*Modal.tsx`, `types/models.ts`.
- Used by: routed under `/admin/*` in `App.tsx`.
- **Not yet connected to:** `services/api.ts` or the Express backend.
- `DataTable.tsx` — generic typed table (`T extends { id: string }`), column-driven, used by every Admin view.
- `Modal.tsx` — generic modal shell (open/title/onClose/children/widthPx), used to host each entity's form.
- `ConfirmDialog.tsx` — generic yes/no confirmation, used for delete actions.
- `AdminNavbar.tsx` / `AdminSidebar.tsx` — Admin-specific chrome, parallel to operator's `navbar.tsx` / `Sidebar.tsx`.
- One form component per admin entity: `EmpresaModal.tsx`, `VinedoModal.tsx`, `SensorModal.tsx`, `DronModal.tsx`, `UmbralModal.tsx`, `UsuarioModal.tsx`.
- Pattern: controlled form fields, `onGuardar`/`onCerrar`-style callbacks handed in from the parent view; view owns the array mutation, modal only edits a draft object.
- Purpose: fixture arrays (`empresasMock`, `vinedosMock`, `sensoresMock`, `dronesMock`, `umbralesMock`, `usuariosMock`) typed against `*Admin` interfaces in `types/models.ts`.
- Explicit doc comment in the file states it should be replaced by real API calls "when connecting" — confirms this is a known temporary state, not an oversight.
- Purpose: Express REST API — one routes/controllers/services triplet per resource.
- Entry: `agrodroid/app/server.js` mounts all route modules under path prefixes matching resource names (`/empresas`, `/vinedos`, `/sensores`, `/drones`, `/alertas`, `/notificaciones`, `/usuarios`, `/imagenes`, `/detecciones`, `/lecturas`, `/umbrales`, `/auth`).
- Depends on: `agrodroid/app/config/db.js` (Postgres pool), `agrodroid/app/middlewares/auth.middleware.js` (JWT).
- Postgres schema and seed data, loaded automatically by the `db` container via `docker-entrypoint-initdb.d`.

## Data Flow

### Operator Request Path (real API)

### Admin CRUD Path (mock-only, NOT wired to API)

- No global store (no Redux/Zustand/Context for domain data) — state lives in `App.tsx` (operator) or per-view `useState` (admin), passed down via props.
- Auth/session state is read ad hoc from `localStorage` (`usuario`, `token`) in `App.tsx`, not centralized.

## Key Abstractions

- Purpose: admin-panel-specific view models (`EmpresaAdmin`, `VinedoAdmin`, `SensorAdmin`, `DronAdmin`, `UmbralAdmin`, `UsuarioAdmin`), separate from operator-facing types (`Empresa`, `Vinedo`, `Sensor`, `Dron`).
- Examples: `agrodroid/web/src/types/models.ts`, consumed by `agrodroid/web/src/mockData.ts` and every `pages/Admin/*View.tsx`.
- Pattern: flat interfaces with an `id: string` field satisfying `DataTable<T extends { id: string }>`'s generic constraint.
- Purpose: single reusable table component driven by a `DataTableColumn<T>[]` config, used identically across all six Admin entity views.
- Examples: `agrodroid/web/src/components/DataTable.tsx`.
- Purpose: consistent create/edit (`Modal` + entity-specific form) and delete (`ConfirmDialog`) UX across all Admin views.
- Examples: `agrodroid/web/src/components/Modal.tsx`, `agrodroid/web/src/components/ConfirmDialog.tsx`.

## Entry Points

- Location: `agrodroid/web/src/main.tsx` → `agrodroid/web/src/App.tsx`
- Triggers: Vite dev server (`npm run dev`) or built bundle served statically
- Responsibilities: route table (public auth routes, `/dashboard/*` operator routes, `/admin/*` admin routes), operator data fetching
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

### Two parallel type hierarchies for the same domain concepts

## Error Handling

- Operator fetches assume success; failures are unhandled at the call site.
- Backend controllers (`agrodroid/app/controllers/*.js`) are the presumed location for request-level error handling; each resource has one controller.

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| cavecrew | > Decision guide for delegating to caveman-style subagents. Tells the main thread WHEN to spawn `cavecrew-investigator` (locate code), `cavecrew-builder` (1-2 file edit), or `cavecrew-reviewer` (diff review) instead of doing the work inline or using vanilla `Explore`. Subagent output is caveman-compressed so the tool-result injected back into main context is ~60% smaller — main context lasts longer across long sessions. Trigger: "delegate to subagent", "use cavecrew", "spawn investigator/builder/reviewer", "save context", "compressed agent output". | `.agents/skills/cavecrew/SKILL.md` |
| caveman | > Ultra-compressed communication mode. Cuts output tokens 65% (measured) by speaking like caveman while keeping full technical accuracy. Supports intensity levels: lite, full (default), ultra, wenyan-lite, wenyan-full, wenyan-ultra. Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens", "be brief", or invokes /caveman. Also auto-triggers when token efficiency is requested. | `.agents/skills/caveman/SKILL.md` |
| caveman-commit | > Ultra-compressed commit message generator. Cuts noise from commit messages while preserving intent and reasoning. Conventional Commits format. Subject ≤50 chars, body only when "why" isn't obvious. Use when user says "write a commit", "commit message", "generate commit", "/commit", or invokes /caveman-commit. Auto-triggers when staging changes. | `.agents/skills/caveman-commit/SKILL.md` |
| caveman-compress | > Compress natural language memory files (CLAUDE.md, todos, preferences) into caveman format to save input tokens. Preserves all technical substance, code, URLs, and structure. Compressed version overwrites the original file. Human-readable backup saved as FILE.original.md. Trigger: /caveman-compress FILEPATH or "compress memory file" | `.agents/skills/caveman-compress/SKILL.md` |
| caveman-help | > Quick-reference card for all caveman modes, skills, and commands. One-shot display, not a persistent mode. Trigger: /caveman-help, "caveman help", "what caveman commands", "how do I use caveman". | `.agents/skills/caveman-help/SKILL.md` |
| caveman-review | > Ultra-compressed code review comments. Cuts noise from PR feedback while preserving the actionable signal. Each comment is one line: location, problem, fix. Use when user says "review this PR", "code review", "review the diff", "/review", or invokes /caveman-review. Auto-triggers when reviewing pull requests. | `.agents/skills/caveman-review/SKILL.md` |
| caveman-stats | > Show real token usage and estimated savings for the current session. Reads directly from the Claude Code session log — no AI estimation. Triggers on /caveman-stats. Output is injected by the mode-tracker hook; the model itself does not compute the numbers. | `.agents/skills/caveman-stats/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
