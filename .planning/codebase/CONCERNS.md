# Codebase Concerns

**Analysis Date:** 2026-07-05

## Tech Debt

**Committed `node_modules/` in backend:**
- Issue: The entire `node_modules` tree for the Express app is tracked in git (971 files under `agrodroid/app/node_modules/`), including native binaries for `bcrypt`.
- Files: `agrodroid/app/node_modules/**` (no `.gitignore` exists in `agrodroid/app/`)
- Impact: Bloats repo size and history, causes noisy diffs, risks platform-specific native binaries (bcrypt) being committed for one OS/arch and breaking on another, and defeats `npm install` reproducibility guarantees.
- Fix approach: Add `agrodroid/app/.gitignore` with `node_modules/`, remove the tracked directory with `git rm -r --cached agrodroid/app/node_modules`, and commit `package-lock.json` only.

**Zip archives of source code committed:**
- Issue: `agrodroid/app/controllers/controllers.zip`, `agrodroid/app/routes/routes.zip`, `agrodroid/app/services/services.zip` sit alongside the actual unpacked source files.
- Files: `agrodroid/app/controllers/controllers.zip`, `agrodroid/app/routes/routes.zip`, `agrodroid/app/services/services.zip`
- Impact: Unclear whether these are stale backups or duplicates that may drift from the real source, confusing for future contributors and reviewers.
- Fix approach: Delete the zip files once confirmed unnecessary, or move them out of the git-tracked tree entirely.

**Duplicated/inconsistent controller error-handling style:**
- Issue: Most controllers wrap logic in `try/catch` and return generic `{ mensaje: "Error..." }` messages (e.g. `agrodroid/app/controllers/sensor.controller.js`, `agrodroid/app/controllers/dron.controller.js`), but `agrodroid/app/controllers/deteccion.controller.js` has no `try/catch` at all.
- Files: `agrodroid/app/controllers/deteccion.controller.js`
- Impact: An error thrown inside `service.obtenerDetecciones()`/`crearDeteccion()` will produce an unhandled promise rejection; Express 4 does not catch async errors automatically, so requests can hang or crash the process depending on Node version behavior.
- Fix approach: Wrap all controller actions in try/catch (or introduce a shared `asyncHandler` wrapper) consistently across all controllers.

**No centralized error-handling middleware:**
- Issue: Every controller manually try/catches and duplicates near-identical error JSON shapes; there is no Express error-handling middleware in `agrodroid/app/server.js`.
- Files: `agrodroid/app/server.js`
- Impact: Inconsistent error payloads, duplicated boilerplate across 11 controllers, harder to add cross-cutting concerns (logging, error codes) later.
- Fix approach: Add a final `app.use((err, req, res, next) => {...})` handler and a shared async wrapper utility.

## Known Bugs

**JWT secret duplicated and hardcoded, ignoring the configured env var:**
- Symptoms: `docker-compose.yml` defines `JWT_SECRET: mipalabrasecreta` as an environment variable for the `app` service, but the code never reads `process.env.JWT_SECRET`.
- Files: `agrodroid/app/middlewares/auth.middleware.js` (`const SECRET_KEY = "AgroDroid_2026";`), `agrodroid/app/services/auth.service.js` (same hardcoded `SECRET_KEY = "AgroDroid_2026"` defined a second time)
- Trigger: Always — the intended configurable secret is dead code; both files silently use the literal string `"AgroDroid_2026"` instead.
- Workaround: None currently; secret is identical and public in source control.

**Public company registration endpoint:**
- Symptoms: `POST /empresas` (create company) is exposed without the `verificarToken` middleware while every other empresa route requires it.
- Files: `agrodroid/app/routes/empresa.routes.js` (`router.post("/", controller.crearEmpresa);`)
- Trigger: Any unauthenticated client can call `POST /empresas` to create arbitrary company records.
- Workaround: None; likely an oversight given all sibling routes require `verificarToken`.

## Security Considerations

**Hardcoded JWT secret committed to source control:**
- Risk: The literal signing secret `"AgroDroid_2026"` is visible in git history in two files. Anyone with repo access (or a leak) can forge valid tokens for any user/role, including `rol` claims used for authorization.
- Files: `agrodroid/app/middlewares/auth.middleware.js`, `agrodroid/app/services/auth.service.js`
- Current mitigation: None.
- Recommendations: Read the secret exclusively from `process.env.JWT_SECRET` (already provisioned in `docker-compose.yml`), fail startup if unset, remove the hardcoded string, and rotate the secret since it has already been exposed in git history.

**Database credentials committed in docker-compose.yml:**
- Risk: `POSTGRES_USER: admin` / `POSTGRES_PASSWORD: admin123` and the app's matching `DB_PASSWORD: admin123` are plaintext in a tracked file.
- Files: `agrodroid/docker-compose.yml`
- Current mitigation: None; `agrodroid/app/config/db.js` does correctly read credentials from environment variables rather than hardcoding them, but the compose file supplies weak, exposed defaults.
- Recommendations: Move secrets to a `.env` file excluded via `.gitignore` (referenced with `env_file:` in compose), and use a non-trivial password even for local/dev environments to build the right habit.

**No route-level authorization/role checks beyond authentication:**
- Risk: `verificarToken` only verifies the JWT signature and attaches `req.usuario`; no controller checks `req.usuario.rol` before allowing mutations (e.g. any authenticated user, regardless of role, can call `crearDron`, `actualizarVinedo`, `eliminarSensor`, etc.).
- Files: `agrodroid/app/middlewares/auth.middleware.js`, all `agrodroid/app/controllers/*.controller.js`
- Current mitigation: `rol` is embedded in the JWT payload but never read post-login.
- Recommendations: Add a role-based authorization middleware (e.g. `requireRole("admin")`) and apply it to mutating routes where appropriate.

**Generic 500 responses may leak stack details via `console.error`:**
- Risk: Controllers log full error objects with `console.error(error)` server-side (fine), but combined with no centralized error handler, any future change that forwards `error.message`/`error.stack` to the client (as `auth.controller.js` already does via `mensaje: error.message`) risks leaking internal details (e.g., raw Postgres constraint errors) to API consumers.
- Files: `agrodroid/app/controllers/auth.controller.js` (returns `error.message` directly in the response body for both register and login failures)
- Current mitigation: None — a Postgres unique-violation or connection error message would be echoed to the client as-is.
- Recommendations: Map known error types to safe user-facing messages and only log full details server-side.

**CORS wide open with no configuration:**
- Risk: `app.use(cors())` in `agrodroid/app/server.js` allows requests from any origin with default settings, appropriate only for early-stage local dev.
- Files: `agrodroid/app/server.js`
- Current mitigation: None.
- Recommendations: Restrict `origin` to known frontend domains before any production deployment.

## Performance Bottlenecks

**No visible pagination on list endpoints:**
- Problem: `listarUsuarios`, `listarSensores`, `listarDrones`, `listarVinedos`, `listarImagenes`, etc. all call `obtener*()` with no limit/offset params.
- Files: `agrodroid/app/controllers/*.controller.js`, corresponding `agrodroid/app/services/*.service.js`
- Cause: Services likely run unbounded `SELECT *` queries (not yet inspected fully, but controller signatures never pass paging params).
- Improvement path: Add `LIMIT`/`OFFSET` or cursor-based pagination once table sizes grow (sensor lecturas and imagenes are the highest-volume tables per `agrodroid/db/init.sql`).

## Fragile Areas

**Auth secret duplicated across two files:**
- Files: `agrodroid/app/middlewares/auth.middleware.js`, `agrodroid/app/services/auth.service.js`
- Why fragile: The same `SECRET_KEY` constant is defined independently in two places; a future edit to rotate/change the secret in only one location will silently break token verification (valid tokens signed with one secret will fail verification against the other) with no compile-time signal.
- Safe modification: Extract a single shared config module (e.g. `agrodroid/app/config/auth.js`) that reads `process.env.JWT_SECRET` once, and import it from both files.
- Test coverage: No automated tests exist in the repository (no test runner, test files, or `test` script found in `agrodroid/app/package.json` or `agrodroid/web/package.json`).

**Inconsistent request validation across controllers:**
- Files: `agrodroid/app/controllers/imagen.controller.js`, `agrodroid/app/controllers/sensor.controller.js`, `agrodroid/app/controllers/dron.controller.js`
- Why fragile: Controllers destructure `req.body`/`req.params` and pass values straight to service/query layers with no schema validation (no Joi/Zod/express-validator dependency present in `agrodroid/app/package.json`). Missing or malformed fields (e.g., missing `Vinedo_idVinedo`) will surface as raw Postgres NOT NULL violations turned into generic 500s.
- Safe modification: Introduce a validation library and validate request bodies before calling services.
- Test coverage: None — no tests exist for any controller or service.

## Test Coverage Gaps

**No automated tests anywhere in the repository:**
- What's not tested: All backend controllers/services (`agrodroid/app/controllers/`, `agrodroid/app/services/`), all frontend pages/components (`agrodroid/web/src/pages/`, `agrodroid/web/src/components/`), and the auth flow (register/login/token verification) specifically.
- Files: No `*.test.js`, `*.spec.js`, `*.test.tsx` files found; `agrodroid/app/package.json` has no `test` script; `agrodroid/web/package.json` was not observed to include a test runner (no Jest/Vitest config files present at repo root or in `agrodroid/web/`).
- Risk: Any regression in authentication, authorization gaps (see empresa creation bug above), or CRUD logic across the 11 resource types will go unnoticed until manual QA or production.
- Priority: High — especially for `agrodroid/app/services/auth.service.js` and the missing-auth route in `agrodroid/app/routes/empresa.routes.js`.

---

*Concerns audit: 2026-07-05*
