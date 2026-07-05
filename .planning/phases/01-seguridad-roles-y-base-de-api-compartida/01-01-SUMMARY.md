---
phase: 01-seguridad-roles-y-base-de-api-compartida
plan: 1
subsystem: auth
tags: [jwt, express, requireRole, rbac, postgres]

# Dependency graph
requires: []
provides:
  - "requireRole(...roles) middleware exported from auth.middleware.js alongside verificarToken"
  - "Single JWT_SECRET env var consumed by both auth.middleware.js and auth.service.js (no hardcoded secret)"
  - "All 11 resource route files gate POST/PUT/DELETE with requireRole(\"admin\")"
  - "usuario.service.js no longer leaks bcrypt hash via PUT /usuarios/:id"
affects: [01-02, admin-phase, monitor-phase, cliente-phase, ti-phase]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "requireRole(...rolesPermitidos) => (req, res, next) closure pattern, matching verificarToken's existing style and {mensaje} error envelope"
    - "Explicit per-route requireRole(\"admin\") whitelist chained after verificarToken (no central permission map)"

key-files:
  created: []
  modified:
    - agrodroid/app/middlewares/auth.middleware.js
    - agrodroid/app/services/auth.service.js
    - agrodroid/app/services/usuario.service.js
    - agrodroid/app/routes/empresa.routes.js
    - agrodroid/app/routes/vinedo.routes.js
    - agrodroid/app/routes/sensor.routes.js
    - agrodroid/app/routes/dron.routes.js
    - agrodroid/app/routes/usuario.routes.js
    - agrodroid/app/routes/umbral.routes.js
    - agrodroid/app/routes/alerta.routes.js
    - agrodroid/app/routes/deteccion.routes.js
    - agrodroid/app/routes/imagen.routes.js
    - agrodroid/app/routes/lectura.routes.js
    - agrodroid/app/routes/notificacion.routes.js

key-decisions:
  - "Both auth.middleware.js and auth.service.js independently read process.env.JWT_SECRET (no shared constants file), matching the codebase's existing per-file env-var convention"
  - "requireRole applied as explicit per-route whitelist rather than a central permission map, per phase D-03"
  - "POST /empresas now requires an admin token; the known consequence (Register.tsx's public company-signup flow will start receiving 401) is accepted per the plan's threat model (T-01-10) and left for a future phase to redesign"

patterns-established:
  - "requireRole(...roles) middleware: fail-closed 403 with {mensaje} JSON envelope when req.usuario is missing or req.usuario.rol not in allowed set"

requirements-completed: [SEC-01, SEC-02, SEC-04]

coverage:
  - id: D1
    description: "JWT secret centralized to process.env.JWT_SECRET in both auth.middleware.js and auth.service.js; no hardcoded literal remains"
    requirement: "SEC-01"
    verification:
      - kind: unit
        ref: "grep -c 'process.env.JWT_SECRET' agrodroid/app/middlewares/auth.middleware.js && agrodroid/app/services/auth.service.js (both = 1)"
        status: pass
    human_judgment: false
  - id: D2
    description: "requireRole(...roles) middleware implemented and exported from auth.middleware.js"
    requirement: "SEC-04"
    verification:
      - kind: unit
        ref: "grep -c requireRole agrodroid/app/middlewares/auth.middleware.js (= 2) + node -c syntax check"
        status: pass
    human_judgment: false
  - id: D3
    description: "requireRole(\"admin\") applied to every existing POST/PUT/DELETE across all 11 resource route files; POST /empresas now requires a valid token (previously none)"
    requirement: "SEC-02"
    verification:
      - kind: unit
        ref: "per-file grep for destructured import + requireRole(\"admin\") on every mutation verb, node -c on all 11 files"
        status: pass
    human_judgment: true
    rationale: "Static grep/syntax checks confirm the code shape is correct, but actually exercising 401/403 behavior requires a running server + issued tokens for non-admin/admin roles (deferred to Plan 01-02's seed migration per the plan's own <verification> section) — a human/integration pass should confirm at runtime."
  - id: D4
    description: "PUT /usuarios/:id no longer returns the contrasenia bcrypt hash in its response body"
    verification:
      - kind: unit
        ref: "grep -c 'RETURNING idusuario, nombreusuario, correo, rol, empresa_idempresa' agrodroid/app/services/usuario.service.js (= 1)"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-05
status: complete
---

# Phase 01 Plan 1: Centralize JWT Secret, Add requireRole RBAC, Close Empresa/Password-Leak Holes Summary

**Single `JWT_SECRET` env-derived secret across both auth files, a fail-closed `requireRole(...roles)` middleware gating every mutation on all 11 resource route files, and removal of a bcrypt-hash leak from `PUT /usuarios/:id`.**

## Performance

- **Duration:** ~3 min
- **Completed:** 2026-07-05
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments
- Removed the two independently-hardcoded `"AgroDroid_2026"` JWT secret literals from `auth.middleware.js` and `auth.service.js`, both now reading `process.env.JWT_SECRET`
- Implemented `requireRole(...rolesPermitidos)` as a named export alongside `verificarToken`, following the exact same closure/error-envelope style already used in the file; fails closed (403) if `req.usuario` is missing or its `rol` isn't in the allowed set
- Applied `requireRole("admin")` to every existing POST/PUT/DELETE across all 11 resource route files (empresa, vinedo, sensor, dron, usuario, umbral, alerta, deteccion, imagen, lectura, notificacion), switching each file's import from a bare function to destructured `{ verificarToken, requireRole }`
- Closed SEC-02: `POST /empresas` previously had no `verificarToken` at all — now requires both a valid token and `admin` role
- Fixed a discovered password-hash leak: `actualizarUsuario`'s `UPDATE ... RETURNING *` no longer returns the bcrypt `contrasenia` column, using the same explicit safe column list already established by `obtenerUsuarioPorId`

## Task Commits

Each task was committed atomically:

1. **Task 1: Centralize JWT secret and implement requireRole middleware** - `70a2f22` (feat)
2. **Task 2: Apply requireRole("admin") to every mutation across all 11 resource route files** - `3bf8e43` (feat)
3. **Task 3: Stop leaking the password hash from PUT /usuarios/:id** - `6e11eb3` (fix)

**Plan metadata:** (pending — recorded in final commit)

## Files Created/Modified
- `agrodroid/app/middlewares/auth.middleware.js` - SECRET_KEY from env; added `requireRole` export; module.exports now `{ verificarToken, requireRole }`
- `agrodroid/app/services/auth.service.js` - SECRET_KEY from env (duplicate literal removed)
- `agrodroid/app/services/usuario.service.js` - `actualizarUsuario` RETURNING clause no longer includes `contrasenia`
- `agrodroid/app/routes/empresa.routes.js` - destructured import; `requireRole("admin")` on POST (newly gated with `verificarToken` too) and PUT
- `agrodroid/app/routes/vinedo.routes.js` - destructured import; `requireRole("admin")` on POST, PUT
- `agrodroid/app/routes/sensor.routes.js` - destructured import; `requireRole("admin")` on POST, PUT, DELETE
- `agrodroid/app/routes/dron.routes.js` - destructured import; `requireRole("admin")` on POST, PUT, DELETE
- `agrodroid/app/routes/usuario.routes.js` - destructured import; `requireRole("admin")` on PUT
- `agrodroid/app/routes/umbral.routes.js` - destructured import; `requireRole("admin")` on POST, PUT
- `agrodroid/app/routes/alerta.routes.js` - destructured import; `requireRole("admin")` on POST, PUT /:id/estado
- `agrodroid/app/routes/deteccion.routes.js` - destructured import; `requireRole("admin")` on POST
- `agrodroid/app/routes/imagen.routes.js` - destructured import; `requireRole("admin")` on POST
- `agrodroid/app/routes/lectura.routes.js` - destructured import; `requireRole("admin")` on POST
- `agrodroid/app/routes/notificacion.routes.js` - destructured import; `requireRole("admin")` on POST

## Decisions Made
- Both auth files independently read `process.env.JWT_SECRET` — no shared constants module introduced, matching the codebase's existing per-file `process.env.*` convention (e.g. `config/db.js`)
- `requireRole` wired as an explicit per-route whitelist (`requireRole("admin")` inline in each route file) rather than a central permission map, per the phase's D-03 decision
- `auth.routes.js` (`/register`, `/login`) intentionally left untouched — must remain fully public

## Deviations from Plan

None - plan executed exactly as written. The plan itself already flagged the `Register.tsx` public-signup regression (T-01-10, accepted) and the `usuario.service.js` password-hash leak (Task 3) as pre-identified, in-scope items — neither required additional judgment calls during execution.

## Issues Encountered
None. All three tasks' automated verification commands passed on first attempt; `node -c` syntax checks passed on all 14 modified files.

## User Setup Required
None - no external service configuration required. `JWT_SECRET` is already defined in `docker-compose.yml`'s `environment:` block (previously unused; now consumed by both auth files) — no `.env` file changes needed for the Docker Compose dev setup.

## Next Phase Readiness
- The `requireRole` mechanism this plan establishes is the single authorization primitive every future role-specific phase (Admin/Monitor/Cliente/TI) will build on
- Runtime verification of 401/403 behavior with real non-admin/admin tokens depends on Plan 01-02's seed migration (seeded users per role) — flagged as `human_judgment: true` in the coverage block above, to be exercised once 01-02 lands
- Known, accepted regression: `agrodroid/web/src/pages/Auth/Register.tsx`'s public `POST /empresas` self-signup call will now receive 401 in all cases. Existing `if (!response.ok) { alert(...); return; }` handling degrades gracefully without crashing. A replacement authenticated onboarding flow is out of this plan's scope and deferred to a future phase.

---
*Phase: 01-seguridad-roles-y-base-de-api-compartida*
*Completed: 2026-07-05*

## Self-Check: PASSED
