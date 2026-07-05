---
phase: 01-seguridad-roles-y-base-de-api-compartida
plan: 3
subsystem: api
tags: [fetch, http-client, typescript, react, vite]

# Dependency graph
requires:
  - phase: 01-seguridad-roles-y-base-de-api-compartida
    provides: JWT secret from env, role-based auth middleware (01-01), 4-role seed data (01-02)
provides:
  - "services/api.ts centralized HTTP client with get/post/put/del, env-driven base URL, auto Bearer token, and thrown-Error non-2xx handling"
affects: [01-04, phase-2-admin-panel]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Single api object export (get/post/put/del) funneling through one private request<T> helper — no axios, plain fetch"]

key-files:
  created: []
  modified: [agrodroid/web/src/services/api.ts]

key-decisions:
  - "Kept the exact export shape export const api = { get, post, put, del } specified by the plan, since Plan 01-04 depends on it verbatim"
  - "Omitted Authorization header entirely when no token in localStorage, rather than sending Bearer null"

patterns-established:
  - "Frontend HTTP calls should route through services/api.ts's api.get/post/put/del instead of raw fetch(); errors surface as thrown Error(mensaje) for existing try/catch + alert(error.message) callers"

requirements-completed: [ADMIN-02]

coverage:
  - id: D1
    description: "services/api.ts implements a single api object (get/post/put/del) with env-driven base URL, automatic Bearer token attachment, and thrown Error(mensaje) on non-2xx responses"
    requirement: "ADMIN-02"
    verification:
      - kind: other
        ref: "grep verification: import.meta.env.VITE_API_URL, localStorage.getItem(\"token\"), export const api all present exactly once; npx tsc --noEmit passes with no errors"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-05
status: complete
---

# Phase 01 Plan 3: Centralized API Client Summary

**Implemented `services/api.ts` as the single `api.get/post/put/del` HTTP client (env-driven base URL, auto Bearer token, Error-throwing on non-2xx) replacing the empty stub, per ADMIN-02/D-07.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-05T21:06:32Z
- **Completed:** 2026-07-05T21:10:01Z
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments
- `services/api.ts` now exports `export const api = { get, post, put, del }`, each generic over `Promise<T>`, funneling through a private `request<T>` helper
- Base URL read once from `import.meta.env.VITE_API_URL`, falling back to `http://localhost:3000` to match the existing hardcoded value across the codebase
- Bearer token automatically attached from `localStorage.getItem("token")` when present; omitted entirely (not `Bearer null`) when absent
- Non-2xx responses now throw `new Error(data.mensaje || "Error de red")` instead of returning the raw `Response`, matching the existing `try { ... } catch (error) { alert(error.message) }` pattern already used by `Login.tsx`

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement the centralized api.ts HTTP client** - `1352d8c` (feat)

**Plan metadata:** (this commit)

_Note: single-task plan, no TDD cycle applicable (tdd="false")_

## Files Created/Modified
- `agrodroid/web/src/services/api.ts` - Centralized HTTP client (previously an empty stub); implements `get/post/put/del` via a private `request<T>` helper with env-driven base URL, auto Bearer token, and Error-throwing on non-2xx

## Decisions Made
- Followed the plan's exact export contract (`export const api = { get, post, put, del }`) without deviation, since Plan 01-04's Login.tsx/App.tsx migration is written against this shape verbatim
- No new npm dependency added (no axios) — plain `fetch`, per plan instruction

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Developers without a `.env` set for `agrodroid/web` continue to fall back to `http://localhost:3000`, matching current behavior.

## Next Phase Readiness

`services/api.ts` is ready for Plan 01-04 to migrate `Login.tsx`/`App.tsx` off raw `fetch()` calls, and for Phase 2's Admin panel to replace `mockData.ts`-backed views with real API calls through this same client. No blockers.

---
*Phase: 01-seguridad-roles-y-base-de-api-compartida*
*Completed: 2026-07-05*

## Self-Check: PASSED
