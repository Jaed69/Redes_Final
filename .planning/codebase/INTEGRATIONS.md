# External Integrations

**Analysis Date:** 2026-07-05

## APIs & External Services

**None detected.** The `agrodroid` API (`agrodroid/app`) is a self-contained REST service with no outbound calls to third-party SaaS/cloud APIs (no email provider, no SMS/push, no payment processor, no cloud storage SDK, no AI/ML service client found in dependencies or source).

- Disease-detection data (`DeteccionEnfermedad` table, `agrodroid/db/init.sql`) and image metadata (`Imagen` table) are stored as if produced by an external drone/vision pipeline, but no such pipeline, model, or API client exists in this repo — detections are seeded as static rows in `init.sql`, not computed live.
- Drone/sensor data (`Dron`, `Sensor`, `LecturaSensor` tables) likewise has no ingestion endpoint wired to real hardware/MQTT/IoT gateway in the codebase; only REST CRUD routes exist (`agrodroid/app/routes/dron.routes.js`, `sensor.routes.js`, `lectura.routes.js`).

## Data Storage

**Databases:**
- PostgreSQL 16 (`postgres:16` Docker image) - `agrodroid/docker-compose.yml`
  - Database name: `vinedosdb`
  - Connection: env vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` consumed in `agrodroid/app/config/db.js`
  - Client: `pg` (node-postgres) `Pool`, raw parameterized SQL queries — no ORM/query builder
  - Schema + seed data: `agrodroid/db/init.sql` (14 tables: `Empresa`, `Vinedo`, `Usuario`, `Dron`, `Sensor`, `LecturaSensor`, `Umbral`, `Imagen`, `DeteccionEnfermedad`, `TipoEnfermedad`, `Alerta`, `TipoAlerta`, `EstadoAlerta`, `Notificacion`)
  - Auto-loaded into the container via `docker-entrypoint-initdb.d` volume mount

**File Storage:**
- Local filesystem only. `Imagen.rutaArchivo` column (`agrodroid/db/init.sql`) stores string paths like `/imagenes/img001.jpg` — no actual file upload/serving endpoint or cloud storage (S3/GCS/etc.) integration exists in `agrodroid/app`.

**Caching:**
- None.

## Authentication & Identity

**Auth Provider:**
- Custom, self-rolled JWT auth (no third-party auth provider/OAuth/Auth0/Firebase Auth)
  - Registration/login: `agrodroid/app/services/auth.service.js`, `agrodroid/app/controllers/auth.controller.js`, routes at `agrodroid/app/routes/auth.routes.js` (`POST /auth/register`, `POST /auth/login`)
  - Passwords hashed with `bcrypt` (10 salt rounds) before storage in `Usuario.contrasenia`
  - On login, JWT signed with payload `{ id, correo, rol }`, 2h expiry
  - Token verification middleware: `agrodroid/app/middlewares/auth.middleware.js` (`verificarToken`) — expects `Authorization: Bearer <token>` header
  - **Security concern:** JWT secret is hardcoded as the literal string `"AgroDroid_2026"` in both `auth.service.js` and `auth.middleware.js`, rather than reading the `JWT_SECRET` env var that IS defined in `agrodroid/docker-compose.yml` but goes unused
  - Frontend stores/sends the token via `Authorization` header helper (`authHeader()`) referenced in `agrodroid/web/src/App.tsx`; login/register flows in `agrodroid/web/src/pages/Auth/Login.tsx` and `agrodroid/web/src/pages/Auth/Register.tsx`

## Monitoring & Observability

**Error Tracking:**
- None. Errors are caught and returned as JSON with `console.error(error)` logging only (e.g. `agrodroid/app/controllers/auth.controller.js`). No Sentry/Datadog/etc.

**Logs:**
- `console.log`/`console.error` only, no structured logging library (no Winston/Pino).

## CI/CD & Deployment

**Hosting:**
- Not configured. No cloud provider config, no Kubernetes manifests, no Vercel/Netlify/Fly config found.

**CI Pipeline:**
- None. No `.github/workflows`, no `.gitlab-ci.yml`, no other CI config detected in the repo.

## Environment Configuration

**Required env vars (API, `agrodroid/app`):**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — consumed in `agrodroid/app/config/db.js`
- `JWT_SECRET` — declared in `agrodroid/docker-compose.yml` but not actually read by the application code (see Auth section above)

**Secrets location:**
- Plaintext in `agrodroid/docker-compose.yml` (`POSTGRES_PASSWORD: admin123`, `JWT_SECRET: mipalabrasecreta`). No `.env` file, no secrets manager. Frontend has no secrets (public API base URL hardcoded as `http://localhost:3000`).

## Webhooks & Callbacks

**Incoming:**
- None. All API routes are conventional CRUD/auth REST endpoints (`agrodroid/app/routes/*.routes.js`) invoked directly by the `agrodroid/web` frontend — no external systems push data via webhook.

**Outgoing:**
- None. `Notificacion` table (`agrodroid/db/init.sql`) models user notifications, but these are stored/read via the REST API only (`agrodroid/app/routes/notificacion.routes.js`) — no email/SMS/push dispatch integration exists to actually deliver them externally.

---

*Integration audit: 2026-07-05*
