# Agrodroid — MVP de monitoreo de viñedos

Aplicación web full‑stack para monitoreo agrícola de viñedos: sensores de campo, drones, detección de enfermedades, alertas y notificaciones. Cuatro roles reales con autorización por backend, datos persistentes en PostgreSQL, despliegue con Docker Compose.

Proyecto final del curso **Redes y Protocolos de Comunicación (UPC)**. El repo también contiene el ejercicio VLSM/Packet Tracer (`Parcila_redes.pkt`, `VLSM Automatico.*`) como sustento del informe TB1 — no es parte del runtime.

---

## Estado del MVP

**Completado (Phases 1–5):**

| Fase | Estado | Entrega |
|------|--------|---------|
| 1 — Seguridad, Roles y Base de API Compartida | ✓ | JWT unificado, 4 roles sembrados, `requireRole` en todas las mutaciones, `.env` fuera de git, cliente HTTP centralizado, enrutado por rol |
| 2 — Panel Admin Datos Reales | ✓ | 6 vistas CRUD (Empresa, Viñedo, Sensor, Dron, Umbral, Usuario) contra API real; `mockData.ts` eliminado; dashboard con KPIs en vivo |
| 3 — Monitor de Campo | ✓ | Drones + lecturas + detecciones cargadas reales; trend chart (`Recharts`) poblado; selector de estado de alerta (Pendiente/En Proceso/Resuelta) |
| 4 — Cliente/Productor | ✓ | Layout propio, dashboard/alertas/reportes de solo lectura filtrados por `empresaId` |
| 5 — TI | ✓ | Layout propio (`/ti`), CRUD de cuentas de usuario, `GET /system/status` (DB + env flags, sin secretos) |

**Verificación:** `bash agrodroid/scripts/verify-walking-skeleton.sh` → 10/10 checks PASS, `WALKING SKELETON VERIFIED`.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js 22 + Express 4.18 + `pg` 8.16 (sin ORM), `bcrypt` 6, `jsonwebtoken` 9 |
| Frontend | React 19 + TypeScript + Vite 8, React Router 7, Leaflet 1.9 (mapas), Recharts 3.9 (gráficos) |
| Base de datos | PostgreSQL 16 |
| Orquestación | Docker + Docker Compose |

Sin framework de tests (MVP). Sin CI/CD. Sin despliegue cloud (el informe TB1 justifica la nube teóricamente; el MVP corre local).

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                React SPA (web/, :5173)                │
│  ┌─────────┬──────────┬──────────┬────────────────┐  │
│  │ Monitor │  Admin   │ Cliente  │       TI       │  │
│  │/dashboard│ /admin  │ /cliente │    /ti/*      │  │
│  └────┬────┴────┬─────┴────┬─────┴────────┬───────┘  │
│       │  services/api.ts (cliente HTTP único)       │
└───────┼─────────────────────────────────────────────┘
        │  Authorization: Bearer <JWT>
        ▼
┌─────────────────────────────────────────────────────┐
│              Express API (app/, :3000)                │
│  routes → controllers → services (3‑tier, por recurso)│
│  verificarToken + requireRole("admin"|"monitor"|...) │
└───────┬─────────────────────────────────────────────┘
        │  pool.query(SQL)
        ▼
┌─────────────────────────────────────────────────────┐
│           PostgreSQL 16 (db/init.sql seed)            │
└───────────────────────────────────────────────────────┘
```

**Recursos REST:** `/auth`, `/usuarios`, `/empresas`, `/vinedos`, `/sensores`, `/drones`, `/umbrales`, `/lecturas`, `/imagenes`, `/detecciones`, `/alertas`, `/notificaciones`, `/system`.

**Modelo de datos** (`db/init.sql`): `Empresa` 1→N `Vinedo` 1→N `Sensor`/`Dron`; `Sensor` 1→N `LecturaSensor`, 1→N `Umbral`; `Dron` 1→N `Imagen` 1→N `DeteccionEnfermedad` N→1 `TipoEnfermedad`; `Alerta` N→1 `Vinedo`/`EstadoAlerta`/`TipoAlerta`; `Notificacion` N→1 `Usuario`/`Alerta`; `Usuario` N→1 `Empresa`.

---

## Roles y permisos

| Rol | Ruta | Lo que puede |
|-----|------|--------------|
| `admin` | `/admin` | CRUD completo sobre Empresa, Viñedo, Sensor, Dron, Umbral, Usuario. Dashboard con KPIs en vivo. |
| `monitor` | `/dashboard` | Ver sensores/drones/lecturas/detecciones de sus viñedos; mapa (Leaflet); trend chart; **cambiar estado de alertas** (Pendiente/En Proceso/Resuelta). |
| `cliente` | `/cliente` | Solo lectura filtrada por `empresaId`: **dashboard con gráficos** (LineChart de tendencia de lecturas + BarChart de alertas por viñedo + panel de notificaciones recientes), **alertas y notificaciones** (tabs, sin mutación), **reportes comparativos** (BarChart activas vs resueltas + PieChart de distribución de estados + ranking). |
| `ti` | `/ti` (dashboard), `/ti/cuentas`, `/ti/sistema` | Dashboard TI con KPIs (usuarios, empresas, DB ok, env faltantes) + últimos usuarios + estado de sistema de un vistazo; CRUD de cuentas (alta/baja/reset password); estado detallado de DB y variables de entorno. |

**Autorización backend:** `verificarToken` en toda ruta protegida; `requireRole(...)` en cada mutación (POST/PUT/DELETE). Frontend Además tiene `RequireRole` guard que bloquea cross‑role por URL.

---

## Cómo correrlo

### Requisitos
- Docker 29+ y Docker Compose v5+
- Puerto 3000 (API), 5173 (web), 5432 (db) libres

### Stack completo
```bash
cd agrodroid
docker compose up -d --build
# web: http://localhost:5173  ·  api: http://localhost:3000
```

### Verificación end‑to‑end
```bash
cd agrodroid
bash scripts/verify-walking-skeleton.sh
# Debe terminar: WALKING SKELETON VERIFIED (10/10 PASS)
```

### Desarrollo en caliente
El `docker-compose.yml` monta `./web/src` y `./app:/app` en vivo — los cambios a TS/JS se reflejan sin rebuild.

### Reset completo (re‑seed)
```bash
cd agrodroid
docker compose down -v
docker compose up -d --build
```

---

## Credenciales sembradas (`db/init.sql`)

| Correo | Contraseña | Rol | Ruta |
|--------|-----------|------|------|
| `admin@agrovina.com` | `admin123` | admin | `/admin` |
| `operador1@agrovina.com` | `clave123` | monitor | `/dashboard` |
| `supervisor1@agrovina.com` | `clave123` | cliente | `/cliente` |
| `ti1@agrovina.com` | `ti123` | ti | `/ti/cuentas` |

Todas las empresas sembradas pertenecen a **AgroVina SAC** ( заходid `1`), por lo que los 4 roles ven el mismo set de viñedos. Para probar aislamiento entre empresas, crear una segunda empresa desde Admin y un usuario asociado.

> **Aviso:** son credenciales de desarrollo. Los hashes bcrypt viven en `db/init.sql`; los plaintexts están documentados solo para facilitar la verificación manual.

---

## Configuración

**`agrodroid/.env`** (ignorado por git, ya creado):
```
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=vinedosdb
DB_HOST=db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=vinedosdb
JWT_SECRET=mipalabrasecreta
```

**Frontend:** `VITE_API_URL` opcional (default `http://localhost:3000`). El `services/api.ts` ya lo respeta.

---

## Estructura del repo

```
Redes_Final/
├── agrodroid/                     # aplicación
│   ├── app/                        # backend Express
│   │   ├── config/db.js            # pool de pg
│   │   ├── controllers/            # 13 controladores
│   │   ├── middlewares/            # verificarToken, requireRole
│   │   ├── routes/                 # 13 routers
│   │   ├── services/               # 13 servicios (SQL crudo)
│   │   └── server.js                # entry, registra rutas
│   ├── db/init.sql                 # schema + seed (4 usuarios, 3 viñedos, 12 drones, 12 sensores, ... )
│   ├── web/                        # frontend React/Vite
│   │   └── src/
│   │       ├── App.tsx            # rutas+state global por rol
│   │       ├── services/api.ts    # cliente HTTP único
│   │       ├── components/        # DataTable, Modal, RequireRole, Sidebar, ...
│   │       ├── modals/            # formularios CRUD Admin/TI
│   │       ├── pages/             # Admin/, Usuario/ (monitor), Cliente/, TI/, Auth/
│   │       └── types/models.ts   # interfaces+ mappers API
│   ├── docker-compose.yml          # db + app + web con montajes en vivo
│   └── scripts/verify-walking-skeleton.sh   # 10 checks end-to-end
├── .planning/                     # artefactos GSD (PROJECT, ROADMAP, STATE, codebase/, phases/)
├── Parcila_redes.pkt              # Packet Tracer (sustento TB1)
├── VLSM Automatico.*              # cálculo VLSM (sustento TB1)
└── DESIGN.md                      # narrative + TB1
```

---

## Requisitos cubiertos

| ID | Requirement | Estado |
|----|-----|--------|
| SEC-01 | JWT secret desde `process.env.JWT_SECRET` | ✓ |
| SEC-02 | `POST /empresas` requiere token | ✓ |
| SEC-03 | CredencialesDB/JWT en `.env` fuera de git | ✓ |
| SEC-04 | `requireRole` bloquea mutaciones por rol | ✓ |
| AUTH-01 | 4 roles en BD | ✓ |
| AUTH-02 | Login enruta por rol | ✓ |
| AUTH-03 | Sin acceso cross‑role | ✓ |
| ADMIN-01 | Vistas Admin contra API real | ✓ |
| ADMIN-02 | `services/api.ts` cliente HTTP centralizado | ✓ |
| ADMIN-03 | CRUD Umbral funcional | ✓ |
| MONITOR-01 | Monitor en (casi) tiempo real | ✓ (refresco on mount, no polling) |
| MONITOR-02 | Cambio de estado de alerta | ✓ |
| STATS-01 | Tendencia por sensor + rango fechas | ✓ |
| CLIENTE-01 | Vista solo lectura filtrada por empresa | ✓ |
| CLIENTE-02 | Sin acciones de mutación | ✓ |
| STATS-02 | Comparativa entre viñedos | ✓ |
| TI-01 | Gestión de cuentas | ✓ |
| TI-02 | Estado de DB + variables de entorno | ✓ |
| INFRA-01 | `docker-compose` 3 servicios correctamente | ✓ |

**19/19 v1 ✓.**

---

## Lo que NO hace este MVP (out of scope)

- **Integración real con Vertex AI / visión computacional** — las detecciones vienen de datos sembrados; no hay pipeline de inferencia.
- **Ingesta real desde drones DJI Mavic 3** — las imágenes son rutas estáticas sembradas.
- **Despliegue en Google Cloud** (Vertex AI, BigQuery, Pub/Sub, Looker Studio) — el informe TB1 lo justifica teóricamente; el MVP corre local en Docker.
- **Multi‑tenancy fino por viñedo** (`Usuario_Vinedo`) — el Cliente ve todos los viñedos de su empresa; el filtrado es por `Empresa_idEmpresa` en frontend (post‑login). Back-end no filtra por empresa todavía (deferred v2).
- **Tests automatizados** — el script `verify-walking-skeleton.sh` es la prueba end‑to‑end; no hay suite unit/integration.
- **Paginación en endpoints de listado** — no es bloqueante con el volumen de datos sembrados.
- **Refresh token / logout server‑side** — el logout limpia `localStorage` en frontend.

---

## Notas de implementación

- **Tipos admin recortados a backend real:** los `*Admin` de `types/models.ts` se ajustaron a los campos que la base devuelve realmente (drop `responsable`, `estado`, `bateria`, `modelo`, `tipo`) — menos archivos que migrar, sin schema changes.
- **`mockData.ts` eliminado** — 0 importaciones tras el refactor.
- **`/system/status` no expone secretos** — solo flags `set`/`unset` + `db: ok/error`.
- **`actualizarEstadoAlerta`** acepta `estado` string (lookup en `EstadoAlerta`) o `estadoalerta_idestado` numérico (retrocompat).
- **Login devuelve `empresaId` + `empresaNombre`** en `usuario` — Cliente/Monitor filtran por empresa en frontend.
- **Detecciones JOIN a TipoEnfermedad + Imagen** ahora devuelven `nombreenfermedad` + `rutaarchivo`.
- **Cliente TI usan shell + design system de DESIGN.md** (Mintlify: Inter, mint accent #00d4a4, pill buttons, hairline cards 12px, elevation 1). Tokens inyectados en `theme.css`; componentes en `styles/Shared/ClienteTi.css`.
- **Cliente Dashboard con gráficos Recharts:** LineChart tendencia de lecturas, BarChart alertas por viñedo (activas vs resueltas), panel de notificaciones recientes. Fltrado real por `empresaId`.
- **Cliente Alertas:** tabs (Alertas + Notificaciones), sin selector de estado (cliente no muta).
- **Cliente Reportes:** BarChart comparativo + PieChart de distribución de estados + tabla ranking.
- **TI Dashboard (`/ti` index):** KPIs (usuarios, empresas, DB ok/fail, env 6/6), últimos 5 usuarios, estado de sistema de un vistazo + accesos rápidos.
- **Docker Compose** monta `./web/src` y `./app:/app` (con `node_modules` anónimo) para dev en caliente.

---

## Script de verificación (`verify-walking-skeleton.sh`)

10 checks end‑to‑end contra un stack recién reconstruido (`down -v && up -d --build`):

1. `docker compose up` levanta `db`+`app`+`web`.
2. `app` responde en `:3000` dentro de 20 intentos.
3. Login de los 4 roles sembrados → 200, mismo `JWT_SECRET`, token capturado.
4. `POST /empresas` sin `Authorization` → **401**.
5. `POST /empresas` con token `monitor` → **403**.
6. `POST /empresas` con token `admin` + body válido → **201**, fila real.
7. `DELETE /empresas/:id` con token `admin` → **200**.
8. `PUT /alertas/1/estado` con token `monitor` + `{"estado":"En Proceso"}` → **200**.
9. `POST /usuarios` con token `ti` → **201**.
10. `GET /system/status` con token `ti` → **200**, `db=ok`, sin secretos.

Salida final: `WALKING SKELETON VERIFIED`.

---

## Licencia y autoría

Proyecto académico — curso Redes y Protocolos de Comunicación, UPC. Uso educativo.

`Parcila_redes.pkt` y `VLSM Automatico.*` son sustento del informe TB1 (topología de red + VLSM). `DESIGN.md` contiene la narrativa del diseño de red.

---

*Última actualización: 2026-07-05 — MVP funcional cerrado.*