# Testing Patterns

**Analysis Date:** 2026-07-05

## Test Framework

**Runner:**
- None configured. No test runner is present in either `agrodroid/app/package.json` or `agrodroid/web/package.json` (no `jest`, `vitest`, `mocha`, `ava`, etc. in dependencies or devDependencies).
- No test config files found (no `jest.config.*`, `vitest.config.*`, `playwright.config.*`, `cypress.config.*`) anywhere in the repo.

**Assertion Library:**
- Not applicable — none present.

**Run Commands:**
```bash
# No test script exists in agrodroid/app/package.json (scripts: { "start": "node server.js" })
# No test script exists in agrodroid/web/package.json (scripts: dev, build, lint, preview)
```
There is currently no `npm test` (or equivalent) command in either project.

## Test File Organization

**Location:**
- Not applicable. `find` across `agrodroid/` for `*.test.*` / `*.spec.*` returns no results.

**Naming:**
- Not established — no precedent to follow yet.

**Structure:**
```
No test directories exist under agrodroid/app or agrodroid/web.
```

## Test Structure

**Suite Organization:**
Not applicable — no existing test suites to model against.

**Patterns:**
- None observed.

## Mocking

**Framework:** None configured.

**Patterns:**
- None observed. The backend calls `pg` directly via a single shared `Pool` in `agrodroid/app/config/db.js` with no dependency-injection seam, no repository abstraction, and no mock/stub layer — this would need to be introduced (e.g. via `pg-mem`, a test database, or manual mocking of `pool.query`) before unit-testing controllers/services in isolation.
- The frontend calls `fetch` directly inline inside components (e.g. `agrodroid/web/src/pages/Auth/Login.tsx`) rather than through a shared, mockable API client — `agrodroid/web/src/services/api.ts` exists but is currently empty (1 line), so there is no central fetch wrapper to mock yet.

**What to Mock:**
- If tests are introduced: mock the `pg` `Pool.query` method for backend service unit tests; mock `fetch`/`global.fetch` (or introduce and mock a central API client) for frontend component tests; mock `jsonwebtoken` and `bcrypt` for `auth.service.js` unit tests.

**What NOT to Mock:**
- Pure functions in `agrodroid/web/src/types/models.ts` (`mapVinedo`, `mapSensor`, `calcularEstadoSensor`, `claseEstadoAlerta`, etc.) have no external dependencies and are the most straightforward candidates for real (non-mocked) unit tests — they take plain data in and return plain data out.

## Fixtures and Factories

**Test Data:**
- None exist. `agrodroid/db/init.sql` contains the schema and could serve as a seed-data reference for integration tests, but no seed/fixture files for tests are present.

**Location:**
- Not applicable.

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

**View Coverage:**
```bash
# Not applicable — no coverage tooling present.
```

## Test Types

**Unit Tests:**
- Not present. Best candidates going forward: `agrodroid/web/src/types/models.ts` mapper/helper functions (pure, no I/O) and `agrodroid/app/services/*.js` (would require mocking `pool.query`).

**Integration Tests:**
- Not present. The backend's controller → service → `pg` pool chain (e.g. `usuario.controller.js` → `usuario.service.js` → `config/db.js`) is a natural integration-test boundary once a test database or `pg-mem` is introduced. `agrodroid/docker-compose.yml` and `agrodroid/db/init.sql` could be reused to spin up a disposable Postgres instance for this purpose.

**E2E Tests:**
- Not used. No Cypress/Playwright/Selenium setup for the React frontend (`agrodroid/web`) or against the running Express API (`agrodroid/app`).

## Common Patterns

**Async Testing:**
```typescript
// No existing pattern. All backend handlers and services are async/await
// (e.g. usuarioService.obtenerUsuarios(), authService.login(data)) and would
// need a runner with native async test support (Jest/Vitest) when introduced.
```

**Error Testing:**
```typescript
// No existing pattern. Backend services throw plain `new Error("mensaje")`
// for expected failure cases (see agrodroid/app/services/auth.service.js
// register/login), which is straightforward to assert against with
// expect(...).rejects.toThrow(...) once a test framework is added.
```

---

*Testing analysis: 2026-07-05*
