# Walking Skeleton — Agrodroid MVP

**Phase:** 1
**Generated:** 2026-07-05

## Capability Proven End-to-End

A user of any of the 4 Agrodroid roles (Admin general, Cliente/Productor, Operador/Monitor de campo, TI) logs in through the existing Login page against a real Postgres-backed API, receives a JWT signed with a secret sourced from `.env` (identical whether verified by `auth.service.js` or `auth.middleware.js`), and is routed by a client-side `RequireRole` guard to their own role's space (`/admin`, `/dashboard`, or a shared `/proximamente` placeholder) — with the backend independently rejecting unauthenticated and cross-role mutation attempts, and every frontend network call flowing through one shared HTTP client.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Backend framework | Express 4.18 + raw `pg` (node-postgres), no ORM | Already established in the codebase; this phase corrects wiring, not stack (CLAUDE.md: "Stack fijo ... no cambiar de stack, solo corregir y completar") |
| Auth | JWT (`jsonwebtoken`) signed with `process.env.JWT_SECRET`, `bcrypt` password hashing, token stored client-side in `localStorage` | Already established pattern; this phase fixes the hardcoded/duplicated secret (SEC-01) and the plaintext-seed/bcrypt-compare mismatch, without introducing a new auth mechanism (e.g. cookies/sessions) — that would be a stack change outside this phase's boundary |
| Role model | 4 short codes as the literal value of `Usuario.rol` and the JWT `rol` claim: `admin`, `cliente`, `monitor`, `ti` (D-01). Long-form labels ("Admin general", "Cliente/Productor", "Operador/Monitor de campo", "TI") are UI-only, mapped from the short code. | Locked decision (CONTEXT.md D-01) — keeps DB/JWT/route-guard comparisons cheap and unambiguous |
| Authorization | Per-route whitelist middleware `requireRole(...roles)` chained after `verificarToken`, explicit on every route (no central permission map) (D-03/D-04) | Matches the existing `verificarToken` pattern exactly — auditable per endpoint, zero new abstraction to learn |
| Frontend routing guard | `<RequireRole roles={[...]}>` wrapper component reading `usuario`/`token` from `localStorage` (same keys Login.tsx already writes), redirecting via `<Navigate replace>` (D-05/D-06) | No new session store introduced; guard sits directly on top of the existing ad hoc `localStorage` session pattern |
| Frontend HTTP client | `services/api.ts` with `get/post/put/del` methods, base URL from `import.meta.env.VITE_API_URL` (fallback `http://localhost:3000`) (D-07) | Establishes the single integration point Phase 2's real Admin panel will reuse |
| Secrets | `agrodroid/.env` (gitignored, real dev values) + `agrodroid/.env.example` (committed template), consumed by `docker-compose.yml` via `${VAR}` interpolation (SEC-03) | Removes plaintext credentials from git without introducing a secrets manager — out of scope for a course-deadline MVP |
| Deployment | `docker compose up` from `agrodroid/` (3 services: `db`, `app`, `web`) | Already the project's only deployment target (CLAUDE.md: no CI/CD, no cloud config) |
| Directory layout | Backend: existing `routes/ -> controllers/ -> services/` triplet per resource. Frontend: existing `pages/<Domain>/*` grouping, extended with a new `pages/Shared/` folder for the cross-role placeholder view. | Matches CONVENTIONS.md; no restructuring needed for this phase |

## Stack Touched in Phase 1

- [x] Project scaffold — already exists (Express/React/Vite/Docker); this phase repairs config wiring (`docker-compose.yml` indentation + secrets), does not reinitialize
- [x] Routing — real routes: `/admin` (role-gated), `/dashboard` (role-gated), new `/proximamente` (role-gated placeholder)
- [x] Database — real read (login `SELECT` against `usuario`, `bcrypt.compare` against real hashed rows) AND real write (seed migration writes 4 bcrypt-hashed role rows at `db` container init; the walking-skeleton verification script performs a real authenticated `POST /empresas` INSERT as its positive-path proof). Full Admin CRUD writes from the UI are Phase 2's job, not this phase's.
- [x] UI — interactive element wired to the API: the existing Login form (migrated to `api.ts`) and the new placeholder view's "Cerrar sesión" button
- [x] Deployment — `docker compose up` (run from `agrodroid/`) is the documented local full-stack run command; this phase is what makes it actually succeed for all 3 services

## Out of Scope (Deferred to Later Slices)

- Admin CRUD screens actually reading/writing real data (Phase 2, ADMIN-01/ADMIN-03) — this phase only makes the *mutation-authorization* mechanism correct and tested; the Admin panel itself keeps using `mockData.ts` until Phase 2.
- Monitor real-time sensor/drone views, alert lifecycle management, trend charts (Phase 3).
- Cliente/Productor read-only dashboards and vineyard comparison (Phase 4).
- TI account management and system-status views (Phase 5) — `cliente`/`ti` roles get only the shared `/proximamente` placeholder in this phase.
- `Usuario_Vinedo` fine-grained multi-tenancy (v2 backlog, TENANT-01).
- Any AI/computer-vision integration (v2 backlog, AI-01/AI-02).
- Redesigning `Register.tsx`'s public self-service company signup. **Known break:** applying SEC-02 (verificarToken on `POST /empresas`) makes this flow return 401 for every attempt, since a brand-new company has no user/token yet. Register.tsx's existing `!response.ok` → `alert(mensaje)` handling already surfaces this without crashing, but the flow is now a dead end. No decision in CONTEXT.md addresses replacing it; flagged for a future phase (e.g. TI-01 account provisioning) rather than invented here.

## Subsequent Slice Plan

- Phase 2: Admin general gets full real-data CRUD (Empresa, Viñedo, Sensor, Dron, Umbral, Usuario) — the first phase to actually exercise the `requireRole('admin')` gate from a live UI.
- Phase 3: Operador/Monitor de campo gets live sensor/drone/alert views and can transition alert status (will reopen `alerta.routes.js`'s `PUT /:id/estado` gate to also allow `monitor`, not just `admin`).
- Phase 4: Cliente/Productor gets a full read-only dashboard and cross-vineyard comparison, replacing their `/proximamente` placeholder.
- Phase 5: TI gets account management and system-status views, replacing their `/proximamente` placeholder.
