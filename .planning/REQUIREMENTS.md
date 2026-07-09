# Requirements: Agrodroid MVP

**Defined:** 2026-07-05
**Core Value:** Un usuario de cada uno de los 4 perfiles puede iniciar sesión y ver/operar exactamente lo que su rol permite, sobre datos reales (no mock), sin huecos de seguridad conocidos.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Seguridad (SEC)

- [x] **SEC-01**: El secreto JWT se lee exclusivamente de `process.env.JWT_SECRET` (elimina el hardcode duplicado en `auth.middleware.js` y `auth.service.js`)
- [x] **SEC-02**: `POST /empresas` requiere `verificarToken` como el resto de rutas de empresa
- [x] **SEC-03**: Credenciales de base de datos y JWT salen de `docker-compose.yml` en texto plano hacia un `.env` ignorado por git
- [x] **SEC-04**: Middleware de autorización por rol (`requireRole(...)`) bloquea acciones de mutación según el perfil del usuario autenticado

### Roles y Autenticación (AUTH)

- [x] **AUTH-01**: `Usuario.rol` soporta 4 valores: Admin general, Cliente/Productor, Operador/Monitor de campo, TI
- [x] **AUTH-02**: El login devuelve el rol del usuario y el frontend enruta a la vista correspondiente según ese rol
- [x] **AUTH-03**: Cada rol solo ve rutas/menús de su propio perfil (sin acceso cruzado a vistas de otro rol)

### Panel Admin (ADMIN)

- [x] **ADMIN-01**: Las vistas Admin (Empresa, Viñedo, Sensor, Dron, Umbral, Usuario) leen y escriben contra la API real, no `mockData.ts`
- [x] **ADMIN-02**: `services/api.ts` implementa un cliente HTTP centralizado (base URL desde variable de entorno, no hardcodeada) usado por Admin y por las vistas existentes de Usuario
- [x] **ADMIN-03**: CRUD de Umbral (mín/máx por sensor) funcional desde la UI Admin contra la tabla `Umbral` existente

### Vista Cliente/Productor (CLIENTE)

- [x] **CLIENTE-01**: Vista de solo lectura: dashboard, alertas y reportes de todos los viñedos de su empresa (filtrado por `Empresa_idEmpresa`)
- [x] **CLIENTE-02**: Sin acceso a acciones de creación/edición/eliminación en ninguna entidad

### Vista Operador/Monitor de campo (MONITOR)

- [x] **MONITOR-01**: Ve sensores, drones y lecturas de sensor en tiempo (casi) real para los viñedos de su empresa
- [x] **MONITOR-02**: Puede cambiar el estado de una alerta entre Pendiente/En Proceso/Resuelta

### Vista TI/Admin de servidores (TI)

- [x] **TI-01**: Gestión de cuentas de usuario (alta/baja/reset básico) separada del panel de administración de negocio
- [x] **TI-02**: Vista de configuración de sistema (al menos: estado de conexión a base de datos, variables de entorno activas sin exponer secretos)

### Monitoreo y Gráficos (STATS)

- [x] **STATS-01**: Gráfico de tendencia de lecturas de sensor por viñedo/rango de fechas (extiende el uso actual de Recharts)
- [x] **STATS-02**: Vista de comparación entre viñedos (alertas totales o lecturas fuera de umbral, por viñedo)

### Infraestructura (INFRA)

- [x] **INFRA-01**: `docker-compose.yml` levanta correctamente los 3 servicios (db, app, web) — corrige el bloque `web` mal indentado fuera de `services:`

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Inteligencia Artificial

- **AI-01**: Integración real con un servicio de visión computacional (Vertex AI u otro) para detección automática de plagas a partir de imágenes de drones
- **AI-02**: Ingesta real de imágenes desde drones DJI Mavic 3 Multispectral

### Multi-tenancy fino

- **TENANT-01**: Asignación de Cliente/Productor a viñedos específicos (tabla `Usuario_Vinedo`) en lugar de "todos los viñedos de la empresa"

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Despliegue en Google Cloud (Vertex AI, BigQuery, Pub/Sub) | El informe TB1 lo evalúa como justificación teórica de nube; el MVP corre local/Docker |
| Ejercicio VLSM / topología Packet Tracer | Ya entregado como parte del informe, no requiere desarrollo de software |
| Tests automatizados exhaustivos | Sin fecha para cobertura completa; se agrega cobertura mínima donde el planner lo considere necesario para no bloquear el MVP |
| Paginación en endpoints de listado | Mejora de performance de `CONCERNS.md`, no bloqueante para el MVP con volumen de datos actual |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Complete |
| SEC-02 | Phase 1 | Complete |
| SEC-03 | Phase 1 | Complete |
| SEC-04 | Phase 1 | Complete |
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| ADMIN-02 | Phase 1 | Complete |
| INFRA-01 | Phase 1 | Complete |
| ADMIN-01 | Phase 2 | Complete |
| ADMIN-03 | Phase 2 | Complete |
| MONITOR-01 | Phase 3 | Complete |
| MONITOR-02 | Phase 3 | Complete |
| STATS-01 | Phase 3 | Complete |
| CLIENTE-01 | Phase 4 | Complete |
| CLIENTE-02 | Phase 4 | Complete |
| STATS-02 | Phase 4 | Complete |
| TI-01 | Phase 5 | Complete |
| TI-02 | Phase 5 | Complete |

**Coverage:**

- v1 requirements: 19 total
- Completed: 19/19 ✓
- Mapped to phases: 19/19 ✓
- Unmapped: 0

## Verification evidence

All 19 requirements verified in runtime (2026-07-08):

| Group | Verification method |
|-------|-------------------|
| SEC-01..04 | `verify-walking-skeleton.sh` steps 4-5: 401/403; `process.env.JWT_SECRET` via grep |
| AUTH-01..03 | init.sql seed (4 roles bcrypt), Login.tsx switch, RequireRole guard, backend filter by `empresaId` in JWT |
| ADMIN-01..03 | 35 `api.get/post` calls in Admin/, 0 `mockData`; UmbralView CRUD complete |
| CLIENTE-01..02 | Cliente tsx filter by `empresaId`; 0 api mutations in Cliente/ |
| MONITOR-01..02 | App.tsx polling 30s lecturas/alertas/notifs; verify step 8: 200 |
| STATS-01..02 | SensorReadingsView LineChart + rango; ClienteReportes BarChart + PieChart + ranking |
| TI-01..02 | TiCuentas GET/PUT/POST/DEL; GET /system/status db=ok + 6 env flags |
| INFRA-01 | docker compose up 3 services; step 2: app responds at :3000 |
---

*Requirements defined: 2026-07-05*
*Last updated: 2026-07-08 — 19/19 verified, all phases complete*
