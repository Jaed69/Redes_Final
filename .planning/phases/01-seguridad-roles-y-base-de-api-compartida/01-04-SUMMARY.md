---
phase: 01-seguridad-roles-y-base-de-api-compartida
plan: 4
subsystem: auth
tags: [react-router, jwt, role-guard, fetch-migration, typescript]

# Dependency graph
requires:
  - phase: 01-seguridad-roles-y-base-de-api-compartida
    provides: services/api.ts centralized HTTP client (01-03), 4-role seed data (01-02), role-based auth middleware (01-01)
provides:
  - "RequireRole client-side route guard reading token/usuario.rol from localStorage"
  - "ComingSoonView shared placeholder for cliente/ti roles at /proximamente"
  - "App.tsx route tree gated by role (dashboard=monitor, admin=admin, proximamente=cliente/ti)"
  - "App.tsx and Login.tsx fully migrated off raw fetch() onto api.ts"
  - "Login.tsx 4-way role redirect switch (admin/monitor/cliente/ti)"
affects: [phase-2-admin-panel, phase-3-monitor, phase-4-cliente, phase-5-ti]

# Tech tracking
tech-stack:
  added: []
  patterns: ["RequireRole as a parent route element rendering Outlet/Navigate, nested one level above existing layout routes", "Coming-soon placeholder view opts into DESIGN.md literal tokens in a scoped CSS file rather than theme.css variables"]

key-files:
  created:
    - agrodroid/web/src/components/RequireRole.tsx
    - agrodroid/web/src/pages/Shared/ComingSoonView.tsx
    - agrodroid/web/src/styles/Shared/ComingSoonView.css
  modified:
    - agrodroid/web/src/App.tsx
    - agrodroid/web/src/pages/Auth/Login.tsx

key-decisions:
  - "RUTA_INICIO_POR_ROL maps admin->/admin (not /admin_dashboard as UI-SPEC's older Interaction section states) — PLAN.md's must_haves and Task 3's action explicitly call out /admin_dashboard as the wrong, retired path being fixed; PLAN.md is authoritative over the stale UI-SPEC reference"
  - "Kept api.get/api.post calls free of explicit generic type arguments (api.get(\"/vinedos\"), not api.get<T>(\"/vinedos\")) because the plan's verification greps require the literal substring api.get( / api.post( — annotated the .then callback parameter (or cast the resolved value) as `any` instead, matching the codebase's existing any-for-parsed-JSON convention used in the same map callbacks"
  - "Login.tsx's api.post result is cast `as any` rather than typed, for the same grep-safety reason, and because api.ts's post<T> has no shared response-shape type yet"

patterns-established:
  - "Route guards nest as an outer parent <Route element={<RequireRole roles={[...]}/>}> wrapping the existing layout route, never replacing or restructuring the child route tree"
  - "Shared/ folder holds views used by more than one role, parallel to existing Usuario/ and Admin/ folders"

requirements-completed: [AUTH-02, AUTH-03, ADMIN-02]

coverage:
  - id: D1
    description: "RequireRole redirects unauthenticated visitors to /login and cross-role visitors to their own role's home route, rendering Outlet only for allowed roles"
    requirement: "AUTH-03"
    verification:
      - kind: other
        ref: "grep verification: roles.includes present exactly once, Outlet present, localStorage.getItem(\"token\") present exactly once — all confirmed"
        status: pass
    human_judgment: true
    rationale: "Redirect behavior for unauthenticated/cross-role navigation across all 4 roles requires exercising the running app (dev server + seeded DB) with real logins, which was not performed in this execution session — automated grep confirms shape/wiring, not runtime behavior."
  - id: D2
    description: "App.tsx's /dashboard, /admin routes gated by RequireRole roles=[monitor]/[admin] respectively, and new /proximamente route gated by roles=[cliente,ti] renders ComingSoonView"
    requirement: "AUTH-03"
    verification:
      - kind: other
        ref: "grep verification: RequireRole x4, ComingSoonView x2, \"/proximamente\" present — all confirmed; npx tsc -p tsconfig.app.json --noEmit shows zero new errors (only 6 pre-existing, unrelated TS6133 errors)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Login.tsx's redirect is a 4-way switch on data.usuario.rol (admin->/admin, monitor->/dashboard, cliente/ti->/proximamente), replacing the old 2-way check against the retired 'Administrador' string and wrong /admin_dashboard path"
    requirement: "AUTH-02"
    verification:
      - kind: other
        ref: "grep verification: switch (data.usuario.rol) present, \"/proximamente\" present, no 'Administrador' string, no hardcoded localhost:3000 origin"
        status: pass
    human_judgment: true
    rationale: "Confirming each of the 4 seeded users actually redirects correctly requires a live login against the running backend/DB, not performed in this execution session."
  - id: D4
    description: "App.tsx's four fetch() calls (vinedos, sensores, alertas, notificaciones) and Login.tsx's login call all go through api.ts instead of raw fetch"
    requirement: "ADMIN-02"
    verification:
      - kind: other
        ref: "grep verification: api.get( x4 in App.tsx, api.post( x1 in Login.tsx, zero fetch( / const API = / http://localhost:3000 remaining in either file; npx tsc -p tsconfig.app.json --noEmit clean of new errors"
        status: pass
    human_judgment: false

duration: 7min
completed: 2026-07-05
status: complete
---

# Phase 01 Plan 4: Client-Side Role Guard and api.ts Adoption Summary

**RequireRole route guard + ComingSoonView placeholder wired into App.tsx's route tree by role, with App.tsx and Login.tsx fully migrated off raw fetch() onto the api.ts client and Login.tsx's redirect fixed to a real 4-way role switch.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-05T21:17:35Z
- **Completed:** 2026-07-05T21:24:06Z
- **Tasks:** 3 completed
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- `RequireRole.tsx` guards route branches: no token -> `/login`, wrong role -> the role's own home route (via `RUTA_INICIO_POR_ROL`), allowed role -> renders `Outlet`
- `ComingSoonView.tsx` + `ComingSoonView.css` give `cliente`/`ti` roles a real (non-mock) landing page at `/proximamente`, styled per UI-SPEC's literal `DESIGN.md` token contract (not `theme.css`)
- `App.tsx`'s `/dashboard` and `/admin` branches are each nested one level under a `RequireRole` parent route (`roles=["monitor"]` and `roles=["admin"]` respectively); a new `/proximamente` route is gated by `roles=["cliente","ti"]`
- All 4 of `App.tsx`'s raw `fetch()` calls (vinedos, sensores, alertas, notificaciones) now go through `api.get(...)`, dropping the manual `.json()` step and the now-unused `API`/`authHeader` constants — this also incidentally fixes a pre-existing silent 401 on vinedos/sensores, which previously never sent an `Authorization` header
- `Login.tsx`'s login call now uses `api.post("/auth/login", ...)`, and its redirect logic is a real 4-way switch on `data.usuario.rol` (`admin`->`/admin`, `monitor`->`/dashboard`, `cliente`/`ti`->`/proximamente`, default->`/dashboard`), replacing the old check against the retired `"Administrador"` string and the wrong `/admin_dashboard` path
- Login failures now surface the backend's actual `error.message` instead of a generic connectivity alert

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the RequireRole guard and the cliente/ti ComingSoonView placeholder** - `35742ee` (feat)
2. **Task 2: Wire RequireRole and ComingSoonView into App.tsx's route tree, migrate its remaining fetch() calls to api.ts** - `02c0464` (feat)
3. **Task 3: Migrate Login.tsx to api.ts and fix the role-redirect switch** - `9b00b89` (feat)

**Plan metadata:** (this commit)

_Note: single-plan feature, no TDD cycle applicable (tdd not requested)_

## Files Created/Modified
- `agrodroid/web/src/components/RequireRole.tsx` - Client-side route guard: redirects on no-token/wrong-role, otherwise renders `Outlet`
- `agrodroid/web/src/pages/Shared/ComingSoonView.tsx` - Placeholder view for `cliente`/`ti` roles with role-interpolated copy and a "Cerrar sesión" action
- `agrodroid/web/src/styles/Shared/ComingSoonView.css` - `DESIGN.md`-literal styling for the placeholder view (scoped, does not touch `theme.css`/global body styles)
- `agrodroid/web/src/App.tsx` - Route tree now nests `/dashboard`/`/admin`/`/proximamente` under `RequireRole`; all 4 data-loading effects use `api.get` instead of raw `fetch`
- `agrodroid/web/src/pages/Auth/Login.tsx` - Login call uses `api.post`; redirect is a 4-way switch on the real role codes; error messages surface backend `mensaje`

## Decisions Made
- Followed PLAN.md's `RUTA_INICIO_POR_ROL` mapping (`admin`->`/admin`) rather than UI-SPEC's older Interaction & Guard Behavior section (which still references the retired `/admin_dashboard` path) — PLAN.md's must_haves and Task 3's action text explicitly identify `/admin_dashboard` as the bug being fixed, making it authoritative over the stale UI-SPEC line
- Avoided explicit generic type arguments on `api.get<T>(...)`/`api.post<T>(...)` calls (would read as `api.get<...>(` which breaks the plan's grep-based verification requiring the literal `api.get(` / `api.post(` substring) — instead annotated the `.then` callback parameter (App.tsx) or cast the resolved value (Login.tsx) as `any`, matching the codebase's pre-existing convention of typing parsed-JSON payloads as `any` before mapping (the same pattern already used 4x in App.tsx's inner map callbacks before this plan)

## Deviations from Plan

None - plan executed exactly as written for the three tasks' `<action>` content; only accommodations were the grep-vs-generics workaround (see Decisions Made) and the PLAN.md-vs-UI-SPEC route-path conflict, neither of which required deviating from the plan's own must_haves/acceptance criteria.

## Issues Encountered

- **RTK proxy shell wrapper was silently misreporting `tsc`/`eslint` output.** The globally-configured `rtk` hook (per user's `~/.claude/RTK.md`) intercepts and summarizes command output; when running `npx tsc -b` (or `npm run build`) directly through the normal shell, it printed `"TypeScript: No errors found"` even when the underlying command exited non-zero with 6 real diagnostics. Discovered by comparing `npm run build`'s raw output (which showed 6 `TS6133` errors) against a plain `npx tsc -b` run (which claimed zero). Resolved by using `rtk proxy npx tsc ...` (the documented raw/unfiltered escape hatch) for all typecheck verification in this plan, and by reading the full log files under `~/.local/share/rtk/tee/` directly when in doubt. All typecheck claims in this summary are based on the `rtk proxy`-verified output, not the summarized one.
- Confirmed via `rtk proxy npx tsc -p tsconfig.app.json --noEmit` that exactly 6 pre-existing `TS6133` unused-variable errors remain (in `App.tsx`'s `setLecturas`/`setDrones`/`setDetecciones`, `AdminNavbar.tsx`'s `navigate`, `navbar.tsx`'s `backendOnline`, `DronesView.tsx`'s `vinedos`) — none of these lines were touched by this plan's tasks; per this session's environment note, they predate this phase and are out of scope.
- `npx vite build` currently fails on unresolved CSS imports in `UmbralView.tsx`/`SensorView.tsx` (`../../styles/admin/shared.css`, likely a case-sensitivity mismatch against the actual `Admin/` folder) — pre-existing, unrelated to any file this plan modifies, not fixed (out of scope per scope-boundary rule).

## Known Stubs

None introduced by this plan — `ComingSoonView` is an intentional, documented placeholder per D-06/AUTH-03 (not a stub masking unfinished work); its content and behavior are fully specified and implemented per UI-SPEC.

## Threat Flags

None — this plan's only new client-side surface (`RequireRole`, `/proximamente`) is already covered by the plan's own `<threat_model>` (T-01-07, accepted).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 01's frontend role plumbing is now real: login determines redirect target, and direct-URL navigation across roles is blocked client-side (backed by the server-side `requireRole` middleware from Plan 01-01 as the actual security boundary).
- `App.tsx` and `Login.tsx` no longer call raw `fetch()` anywhere — Phase 2's Admin panel work can extend the same `api.ts` client pattern when replacing `mockData.ts`.
- **Not yet verified live:** actual login-and-redirect behavior for each of the 4 seeded roles, and direct-URL cross-role navigation blocking, were confirmed via static grep/typecheck only in this execution session — a live UAT pass (e.g. via `/gsd-verify-work`) against the running dev server + seeded DB is recommended before considering AUTH-02/AUTH-03 fully closed.
- Pre-existing, out-of-scope issues remain and are unaffected by this plan: 6 `TS6133` unused-variable errors elsewhere in the codebase, and a `vite build` CSS-import case-sensitivity failure in `UmbralView.tsx`/`SensorView.tsx`.

---
*Phase: 01-seguridad-roles-y-base-de-api-compartida*
*Completed: 2026-07-05*

## Self-Check: PASSED

All 5 created/modified files confirmed present on disk. All 3 task commits (35742ee, 02c0464, 9b00b89) confirmed present in git history.
