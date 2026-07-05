# Coding Conventions

**Analysis Date:** 2026-07-05

## Naming Patterns

**Files (backend `agrodroid/app/`):**
- `<recurso>.controller.js`, `<recurso>.service.js`, `<recurso>.routes.js` — one file per resource, mirrored across three layers. E.g. `usuario.controller.js` / `usuario.service.js` / `usuario.routes.js`.
- Middlewares: `<nombre>.middleware.js` (e.g. `auth.middleware.js`).
- Config: `config/db.js` for the shared `pg` pool.
- Language: all identifiers, comments, and JSON response keys are in **Spanish** (`usuario`, `vinedo`, `sensor`, `mensaje`, `contrasenia`). Keep new backend code in Spanish to match existing resources.

**Files (frontend `agrodroid/web/src/`):**
- Components: PascalCase (`StatCard.tsx`, `Sidebar.tsx`) — with one exception, `components/navbar.tsx` is lowercase (inconsistent; follow PascalCase for new components).
- Pages grouped by role/domain folder: `pages/Auth/Login.tsx`, `pages/Usuario/DashboardView.tsx`.
- Styles mirror page/component structure under `styles/`, one `.css` file per component/page (`styles/Usuario/DronesView.css`), plus a shared `styles/Usuario/shared.css` and `styles/Usuario/theme.css` for tokens.
- Types: single central `src/types/models.ts` for all API/domain types (no per-feature type files).

**Functions:**
- Backend: verb + noun in Spanish, camelCase — `obtenerUsuarios`, `obtenerUsuarioPorId`, `actualizarUsuario`, `listarUsuarios`. CRUD naming convention: `listar*` (list all), `obtener*` (get one), `crear*`/`registrar*` (create), `actualizar*` (update), `eliminar*` (delete).
- Frontend: `mapX` for API→domain mappers (`mapVinedo`, `mapSensor`, `mapDeteccion`), `calcular*`/`clase*` for derived-value helpers (`calcularEstadoSensor`, `claseEstadoAlerta`).

**Variables:**
- Spanish nouns throughout backend (`usuario`, `resultado`, `existe`, `coincide`).
- Database columns are lowercase/no-separator (`idusuario`, `nombreusuario`, `empresa_idempresa`) — this is Postgres' folded identifier style, not a JS convention; controllers/services destructure request bodies in camelCase (`nombreUsuario`, `correo`) even though DB columns are flat-case.

**Types (frontend, `src/types/models.ts`):**
- Two-tier type system, explicitly commented in the file:
  - Section A — `Api*` prefixed interfaces: raw shapes exactly as the Express/pg endpoints return them (flat-case fields, e.g. `ApiUsuarioListado.nombreusuario`).
  - Section B — domain interfaces without prefix, camelCase fields, used by views (`Usuario`, `Vinedo`, `Sensor`).
  - Section C — `map<Entity>` pure functions convert Api → domain types, plus derived/computed fields (e.g. `estado: EstadoSensor` computed by `calcularEstadoSensor`, not present in the DB).
- Follow this pattern for any new resource: add `ApiX` (raw), `X` (domain), and `mapX` (converter) to `models.ts` rather than typing components directly from raw API shapes.

## Code Style

**Formatting:**
- No Prettier config detected in either `agrodroid/app` or `agrodroid/web`. Indentation is 4 spaces in backend JS, 2 spaces in frontend TS/TSX — follow the existing file's indentation when editing.
- Backend style is verbose/spaced: blank lines after `try {`, before `catch`, and around blocks (see `agrodroid/app/controllers/usuario.controller.js`). Not universally consistent — some files (`obtenerUsuario`) are tighter than others (`listarUsuarios`). Match the surrounding function's density rather than imposing one style.

**Linting:**
- Backend (`agrodroid/app`): no ESLint config, no lint script in `package.json`.
- Frontend (`agrodroid/web`): ESLint flat config at `agrodroid/web/eslint.config.js` using `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite variant). Run via `npm run lint` in `agrodroid/web`. Ignores `dist/`. Only applies to `**/*.{ts,tsx}`.

## Import Organization

**Backend (CommonJS, `require`):**
- Order observed: framework (`express`), route/module requires, then local instantiation. E.g. `agrodroid/app/server.js` requires all `./routes/*` before `express()` is instantiated, with `cors` required afterward (inconsistent ordering — no strict convention enforced).
- Controllers `require` their paired service only: `const usuarioService = require("../services/usuario.service")`.
- Routes `require` `express`, the paired controller, and `../middlewares/auth.middleware`.

**Frontend (ESM):**
- Order in `.tsx` files: external packages (`react`, `react-router-dom`) first, then relative CSS import last (`import "../../styles/Auth/Login.css"`). See `agrodroid/web/src/pages/Auth/Login.tsx`.
- No path aliases configured — all imports are relative (`../../styles/...`, `../services/api`).
- `import type { X } from "..."` used for type-only imports (`agrodroid/web/src/components/StatCard.tsx`).

## Error Handling

**Backend:**
- Controllers wrap the service call in `try { ... } catch (error) { console.error(error); res.status(...).json({ mensaje: ... }) }`. This pattern is repeated in every controller (`usuario.controller.js`, `auth.controller.js`, etc.) — replicate it exactly for new endpoints.
- Status codes: `500` for unexpected/internal errors, `401` for auth failures (`agrodroid/app/controllers/auth.controller.js` login catch), `404` for not-found (`usuario.controller.js` obtenerUsuario), `400`/`404` per-resource as needed.
- Services throw plain `new Error("mensaje en español")` for business-rule failures (duplicate email, bad credentials — `agrodroid/app/services/auth.service.js`); controllers surface `error.message` directly to the client in the auth flow (`res.status(401).json({ mensaje: error.message })`), but hide internal errors behind generic messages elsewhere (`"Error obteniendo usuarios"`). When writing new services, throw `Error` with a user-facing Spanish message only when it's safe to expose (validation/business errors), not for infra failures.
- No centralized error-handling middleware; every controller function has its own try/catch. No custom error classes.

**Frontend:**
- `try/catch` around `fetch` calls with `alert(...)` for user-facing errors and `console.error(error)` for diagnostics (`agrodroid/web/src/pages/Auth/Login.tsx`). No toast/notification system — `alert()` is the current mechanism for surfacing frontend errors to users.
- HTTP failures checked via `if (!response.ok)` after parsing JSON, not via `try/catch` on the fetch itself.

## Logging

**Framework:** `console.log`/`console.error` only, both backend and frontend. No structured logging library.

**Patterns:**
- Backend: `console.error(error)` inside every catch block before responding with an error JSON.
- Backend: `console.log("Servidor corriendo en puerto 3000")` on startup (`agrodroid/app/server.js`).
- Frontend: `console.log(data)` after successful login (debug leftover in `Login.tsx`) and `console.error(error)` in catch blocks.

## Comments

**When to Comment:**
- Backend: sparse; occasional Spanish inline comments marking sections (`// Comparar contraseña`, `// Generar token` in `auth.service.js`; `// Configuración del puerto` in `server.js`).
- Frontend `models.ts` is the exception — heavily annotated with JSDoc-style block comments explaining data-shape mismatches between the Postgres/Express API and the domain model ("gap 1", "gap 2" markers referencing missing FKs/fields). New type additions to this file should keep documenting such API/domain discrepancies inline.

**JSDoc/TSDoc:**
- Used selectively in `agrodroid/web/src/types/models.ts` to document endpoint origin (`/** POST /auth/login → resultado.usuario (auth.service.js) */`) and known data gaps. Not used elsewhere in the frontend or anywhere in the backend.

## Function Design

**Size:** Controllers and services are small, single-purpose functions (10-50 lines), one per CRUD operation. No shared base classes; each resource is a flat set of exported functions.

**Parameters:** Backend service functions take explicit positional primitives (`actualizarUsuario(id, nombreUsuario, correo, rol)`) rather than a single object, for simple resources; `auth.service.js register(data)` takes the whole `req.body` object and destructures internally. No single consistent parameter-passing style — check the sibling service file before choosing.

**Return Values:** Backend services return raw `pg` row objects/arrays (`result.rows`, `result.rows[0]`) directly — no DTO/response-shaping layer in the backend; all API-shape adaptation happens client-side in `models.ts` mappers.

## Module Design

**Exports:** Backend: `module.exports = { fn1, fn2, ... }` object literal at the bottom of every controller/service/routes file. Frontend: default export per component (`export default function StatCard(...)`, `export default Login`), named exports for types/mappers/utilities in `models.ts`.

**Barrel Files:** None. No `index.ts`/`index.js` re-export files in either `agrodroid/app` or `agrodroid/web/src`. Import directly from the specific module path.

---

*Convention analysis: 2026-07-05*
