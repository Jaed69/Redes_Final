# Phase 1: Seguridad, Roles y Base de API Compartida - Pattern Map

**Mapped:** 2026-07-05
**Files analyzed:** 11
**Analogs found:** 11 / 11 (all modifications to existing files; no analog search needed for most — editing in place)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `agrodroid/app/middlewares/auth.middleware.js` | middleware | request-response | itself (`verificarToken` pattern extended with `requireRole`) | exact |
| `agrodroid/app/services/auth.service.js` | service | CRUD (auth) | itself (`login`/`register`) | exact |
| `agrodroid/app/routes/*.js` (11 files: empresa, vinedo, sensor, dron, usuario, umbral, alerta, deteccion, imagen, lectura, notificacion) | route | CRUD | `agrodroid/app/routes/sensor.routes.js` (full CRUD w/ verb-per-method) | exact |
| `agrodroid/db/init.sql` | migration | batch (schema + seed) | itself (`Usuario` table + seed INSERT) | exact |
| `agrodroid/docker-compose.yml` | config | n/a | itself | exact |
| `agrodroid/app/.env` (new) | config | n/a | `agrodroid/app/config/db.js` (already reads `process.env.*`) | exact |
| `agrodroid/web/src/services/api.ts` | utility (HTTP client) | request-response | `agrodroid/web/src/App.tsx` fetch blocks (lines 72-144) | role-match (adapting ad hoc fetch to a client) |
| `agrodroid/web/src/App.tsx` | provider/router | request-response | itself (existing `useEffect`+`fetch` blocks, existing `<Routes>` tree) | exact |
| `agrodroid/web/src/pages/Auth/Login.tsx` | component | request-response | itself (existing `handleSubmit` fetch + role redirect) | exact |
| `agrodroid/web/src/components/RequireRole.tsx` (new) | component (guard) | n/a | No direct analog — closest precedent is the `usuario`/`token` `localStorage` read pattern in `App.tsx` line 41 and `Login.tsx` lines 35-47 | role-match |
| `agrodroid/web/src/pages/*/ComingSoonView.tsx` (new placeholder for cliente/ti) | component | n/a | `agrodroid/web/src/pages/Usuario/DashboardView.tsx`-style simple view (structure only) | partial |

## Pattern Assignments

### `agrodroid/app/middlewares/auth.middleware.js` (middleware, request-response)

**Analog:** itself, current `verificarToken` (full file, 35 lines)

**Current pattern to fix and extend:**
```javascript
const jwt = require("jsonwebtoken");

const SECRET_KEY = "AgroDroid_2026";   // <- BUG: hardcoded, must become process.env.JWT_SECRET

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const usuario = jwt.verify(token, SECRET_KEY);
        req.usuario = usuario;   // <- requireRole reads req.usuario.rol, set here
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido" });
    }
};

module.exports = verificarToken;
```

**New `requireRole` — copy the exact same closure/export style, added to this same file:**
```javascript
// Follows same signature style as verificarToken: (req, res, next) closure, same error shape
const requireRole = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "No autorizado para esta acción" });
    }
    next();
};

module.exports = { verificarToken, requireRole }; // NOTE: changes export shape from function to object — every route file's `require("../middlewares/auth.middleware")` call site must destructure accordingly
```

**Env pattern to copy** (from `agrodroid/app/config/db.js` lines 1-9): `process.env.DB_USER`, etc. — apply identically as `process.env.JWT_SECRET` here and in `auth.service.js`.

---

### `agrodroid/app/services/auth.service.js` (service, CRUD/auth)

**Analog:** itself (full file, 114 lines)

**Duplicated hardcoded secret to fix** (line 53):
```javascript
const SECRET_KEY = "AgroDroid_2026";
```
Replace with `const SECRET_KEY = process.env.JWT_SECRET;` — single source of truth shared conceptually with `auth.middleware.js` (both env-driven, no shared import needed since they're separate processes reading the same env var).

**Core login/JWT pattern to preserve** (lines 87-98):
```javascript
const token = jwt.sign(
    { id: usuario.idusuario, correo: usuario.correo, rol: usuario.rol },
    SECRET_KEY,
    { expiresIn: "2h" }
);
```
`rol` claim already flows through — D-01's 4 short codes (`admin`, `cliente`, `monitor`, `ti`) just need to exist as DB values; no service code change needed beyond the secret fix.

**Error handling pattern** (lines 20-22, 71-73, 83-85): `throw new Error("mensaje en español")` for business-rule failures — reuse exactly for any new validation (e.g., rejecting unknown `rol` values on register, if added).

---

### `agrodroid/app/routes/*.js` (route, CRUD) — apply `requireRole('admin')` to mutations

**Analog:** `agrodroid/app/routes/sensor.routes.js` (full file, 17 lines) — has all 4 verbs, best template.

**Current pattern (all resource route files share this shape):**
```javascript
const express = require("express");
const router = express.Router();

const sensorController = require("../controllers/sensor.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, sensorController.listarSensores);
router.get("/:id", verificarToken, sensorController.obtenerSensor);
router.post("/", verificarToken, sensorController.crearSensor);
router.put("/:id", verificarToken, sensorController.actualizarSensor);
router.delete("/:id", verificarToken, sensorController.eliminarSensor);

module.exports = router;
```

**Target pattern per D-03/D-04** (whitelist explicit, per-route, GET unchanged, mutations gated):
```javascript
const { verificarToken, requireRole } = require("../middlewares/auth.middleware"); // import shape changes — see middleware note above

router.get("/", verificarToken, sensorController.listarSensores);
router.get("/:id", verificarToken, sensorController.obtenerSensor);
router.post("/", verificarToken, requireRole("admin"), sensorController.crearSensor);
router.put("/:id", verificarToken, requireRole("admin"), sensorController.actualizarSensor);
router.delete("/:id", verificarToken, requireRole("admin"), sensorController.eliminarSensor);
```

Apply the same edit to: `empresa.routes.js`, `vinedo.routes.js`, `dron.routes.js`, `umbral.routes.js`, `usuario.routes.js` (currently only GET+PUT, add `requireRole('admin')` to the PUT — see below), plus any mutation verbs present in `alerta.routes.js`, `deteccion.routes.js`, `imagen.routes.js`, `lectura.routes.js`, `notificacion.routes.js` (verify each file's exact verbs individually; GET-only routes need no change beyond the `require` destructure if `auth.middleware.js` export shape changes).

**`usuario.routes.js` current state (full file, 11 lines) — needs `requireRole` only on PUT:**
```javascript
router.get("/", verificarToken, usuarioController.listarUsuarios);
router.get("/:id", verificarToken, usuarioController.obtenerUsuario);
router.put("/:id", verificarToken, usuarioController.actualizarUsuario);
```
→ add `requireRole("admin")` before `usuarioController.actualizarUsuario`.

---

### `agrodroid/db/init.sql` (migration, batch)

**Analog:** itself, current `Usuario` table (lines 124-132) + seed (lines 293-297)

**Current schema (no change needed to column def, `rol` is already `varchar(100)`):**
```sql
CREATE TABLE Usuario (
    idUsuario int GENERATED ALWAYS AS IDENTITY,
    nombreUsuario varchar(255)  NOT NULL UNIQUE,
    ...
    rol varchar(100)  NOT NULL,
    ...
);
```

**Current seed to migrate (lines 293-297):**
```sql
INSERT INTO Usuario (nombreUsuario, correo, contrasenia, rol, Empresa_idEmpresa) VALUES
('admin', 'admin@agrovina.com', 'admin123', 'Administrador', 1),
('supervisor1', 'supervisor1@agrovina.com', 'clave123', 'Usuario', 1),
('operador1', 'operador1@agrovina.com', 'clave123', 'Usuario', 1);
```
Per D-02: `'Administrador'` → `'admin'`; assign one of the existing `'Usuario'` rows to `'monitor'`, one to `'cliente'`, and add a 4th row with `'ti'`. **Caution:** `contrasenia` values here are plaintext (`'admin123'`), but `auth.service.js` login compares via `bcrypt.compare` (line 78-81) — these seed passwords must be bcrypt hashes to actually authenticate, or this is a pre-existing bug outside this phase's explicit scope (flag for planner: seed passwords look unhashed, `bcrypt.compare` will fail against plaintext).

---

### `agrodroid/docker-compose.yml` (config)

**Analog:** itself (full file, 39 lines)

**Bug 1 — plaintext creds to move to `.env`:**
```yaml
environment:
  POSTGRES_USER: admin
  POSTGRES_PASSWORD: admin123
  ...
  DB_PASSWORD: admin123
  JWT_SECRET: mipalabrasecreta
```
Replace hardcoded values with `${VAR_NAME}` interpolation reading from a `.env` file at compose root (`agrodroid/.env`), e.g. `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}`, and add `agrodroid/.env` to `.gitignore` (none exists yet — must be created).

**Bug 2 — `web` block indentation (lines 33-38 currently sibling to `services:`, must nest under it):**
```yaml
  web:
    build: ./web
    container_name: agrodroid-web
    ports:
      - "5173:5173"
    depends_on:
      - app
```
(2-space indent to match `db:`/`app:` siblings under `services:`.)

---

### `agrodroid/web/src/services/api.ts` (utility/HTTP client, request-response)

**Analog:** `agrodroid/web/src/App.tsx` ad hoc fetch pattern (lines 72-144) — this is the pattern being centralized, not an existing client to copy structurally. No existing typed API client in the codebase; this is genuinely new.

**Patterns to preserve from `App.tsx`:**
```typescript
// Base URL convention (line 72, to become env-driven per D-07):
const API = "http://localhost:3000";
// →  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Auth header convention (lines 74-76):
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
```

**Error handling convention to carry into `api.ts`** (from `Login.tsx` lines 27-32, the only place `!response.ok` is checked):
```typescript
const data = await response.json();
if (!response.ok) {
  alert(data.mensaje);   // mensaje key matches backend's { mensaje } error shape
  return;
}
```
The planner's `api.ts` methods (`get/post/put/del`) should check `response.ok` and surface `data.mensaje` consistently, matching backend's `{ mensaje: "..." }` error envelope (see Shared Patterns below).

---

### `agrodroid/web/src/App.tsx` (provider/router, request-response)

**Analog:** itself — migrate each `useEffect` fetch block (4 total: vinedos, sensores, alertas, notificaciones, lines 81-144) to call `api.get(...)` instead of raw `fetch`.

**Current per-resource pattern to replace (example, lines 96-111):**
```typescript
useEffect(() => {
  fetch(`${API}/sensores`)
    .then((r) => r.json())
    .then((data) => setSensores(data.map((s: any) => ({ ... }))));
}, []);
```
Keep the `.map()` domain-mapping logic identical; only the fetch call itself changes to `api.get("/sensores")`.

**Route tree pattern to wrap with `RequireRole`** (lines 174-282): `/admin` branch (lines 253-276) needs `<RequireRole roles={["admin"]}>` wrapping the `<AdminLayout>` route; `/dashboard` branch (lines 182-247) needs `<RequireRole roles={["monitor"]}>` wrapping `<AppLayout>`. New placeholder routes for `cliente`/`ti` added as siblings.

---

### `agrodroid/web/src/pages/Auth/Login.tsx` (component, request-response)

**Analog:** itself (full file, 96 lines)

**Current fetch pattern to migrate to `api.ts`** (lines 15-32):
```typescript
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ correo, contrasenia }),
});
const data = await response.json();
if (!response.ok) {
  alert(data.mensaje);
  return;
}
```
→ becomes `const data = await api.post("/auth/login", { correo, contrasenia });` (exact error-surfacing contract to preserve inside `api.ts` itself, since this call site no longer sees `response.ok` directly).

**Role redirect bug to fix** (lines 42-47):
```typescript
if (data.usuario.rol === "Administrador") {
  navigate("/admin_dashboard");   // also wrong path — should be "/admin"
} else {
  navigate("/dashboard");
}
```
→ replace with a 4-way switch per D-01/D-05/D-06:
```typescript
switch (data.usuario.rol) {
  case "admin": navigate("/admin"); break;
  case "monitor": navigate("/dashboard"); break;
  case "cliente":
  case "ti": navigate("/proximamente"); break;
  default: navigate("/dashboard");
}
```

**Debug leftover to note (not necessarily remove per project conventions):** `console.log(data)` (line 40) — existing convention keeps such logs; planner's discretion whether to strip it.

---

### `agrodroid/web/src/components/RequireRole.tsx` (new, guard component)

**No direct analog exists.** Closest precedent for reading session state is the ad hoc pattern in `App.tsx` line 41:
```typescript
const usuario = JSON.parse(localStorage.getItem("usuario") || "{}") as Usuario;
```
and `Login.tsx` lines 35-38 for what gets written to `localStorage`:
```typescript
localStorage.setItem("token", data.token);
localStorage.setItem("usuario", JSON.stringify(data.usuario));
```
Per CONTEXT.md D-05/D-06 and Claude's Discretion: build `RequireRole` to read `localStorage.getItem("usuario")`, parse `.rol`, and redirect (via `<Navigate>`) if not in the allowed set — no existing guard component to copy structurally; this is genuinely new but must read the same `localStorage` keys, not introduce a new store (per Integration Points in CONTEXT.md).

## Shared Patterns

### Backend error response envelope
**Source:** `agrodroid/app/controllers/auth.controller.js` (lines 14-21, 32-39) and every other `*.controller.js`
**Apply to:** any new controller code (none expected this phase, but `requireRole`'s 403 response must match this shape)
```javascript
} catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: error.message }); // or appropriate status code
}
```
`requireRole`'s failure response (`res.status(403).json({ mensaje: "..." })`) already matches this envelope — verified above.

### Env-driven config
**Source:** `agrodroid/app/config/db.js` (lines 3-9)
**Apply to:** `auth.middleware.js`, `auth.service.js`, `docker-compose.yml`
```javascript
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    ...
});
```
Same `process.env.X` convention to apply for `JWT_SECRET`.

### Route middleware chaining
**Source:** every `*.routes.js` file (e.g. `sensor.routes.js` lines 7-15)
**Apply to:** all 11 route files needing `requireRole`
```javascript
router.<verb>("/path", verificarToken, [requireRole("admin"),] controller.method);
```
Second-argument-after-verificarToken insertion point, per D-03.

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `agrodroid/web/src/components/RequireRole.tsx` | component (guard) | n/a | No route-guard component exists yet in codebase; genuinely new pattern, built from `localStorage` conventions in `App.tsx`/`Login.tsx` |
| `agrodroid/web/src/pages/*/ComingSoonView.tsx` (placeholder) | component | n/a | No prior "coming soon" placeholder view exists; content is Claude's Discretion per CONTEXT.md |
| `agrodroid/.env` / `agrodroid/app/.env` (new files) | config | n/a | No `.env` file exists anywhere in repo yet — first one being introduced this phase |

## Metadata

**Analog search scope:** `agrodroid/app/{middlewares,services,controllers,routes,config}`, `agrodroid/db/init.sql`, `agrodroid/docker-compose.yml`, `agrodroid/web/src/{App.tsx,services,pages/Auth,components}`
**Files scanned:** 18 (read fully or via targeted grep)
**Pattern extraction date:** 2026-07-05
