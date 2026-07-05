# Requirements: Agrodroid MVP

**Defined:** 2026-07-05
**Core Value:** Un usuario de cada uno de los 4 perfiles puede iniciar sesión y ver/operar exactamente lo que su rol permite, sobre datos reales (no mock), sin huecos de seguridad conocidos.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Seguridad (SEC)

- [ ] **SEC-01**: El secreto JWT se lee exclusivamente de `process.env.JWT_SECRET` (elimina el hardcode duplicado en `auth.middleware.js` y `auth.service.js`)
- [ ] **SEC-02**: `POST /empresas` requiere `verificarToken` como el resto de rutas de empresa
- [ ] **SEC-03**: Credenciales de base de datos y JWT salen de `docker-compose.yml` en texto plano hacia un `.env` ignorado por git
- [ ] **SEC-04**: Middleware de autorización por rol (`requireRole(...)`) bloquea acciones de mutación según el perfil del usuario autenticado

### Roles y Autenticación (AUTH)

- [ ] **AUTH-01**: `Usuario.rol` soporta 4 valores: Admin general, Cliente/Productor, Operador/Monitor de campo, TI
- [ ] **AUTH-02**: El login devuelve el rol del usuario y el frontend enruta a la vista correspondiente según ese rol
- [ ] **AUTH-03**: Cada rol solo ve rutas/menús de su propio perfil (sin acceso cruzado a vistas de otro rol)

### Panel Admin (ADMIN)

- [ ] **ADMIN-01**: Las vistas Admin (Empresa, Viñedo, Sensor, Dron, Umbral, Usuario) leen y escriben contra la API real, no `mockData.ts`
- [ ] **ADMIN-02**: `services/api.ts` implementa un cliente HTTP centralizado (base URL desde variable de entorno, no hardcodeada) usado por Admin y por las vistas existentes de Usuario
- [ ] **ADMIN-03**: CRUD de Umbral (mín/máx por sensor) funcional desde la UI Admin contra la tabla `Umbral` existente

### Vista Cliente/Productor (CLIENTE)

- [ ] **CLIENTE-01**: Vista de solo lectura: dashboard, alertas y reportes de todos los viñedos de su empresa (filtrado por `Empresa_idEmpresa`)
- [ ] **CLIENTE-02**: Sin acceso a acciones de creación/edición/eliminación en ninguna entidad

### Vista Operador/Monitor de campo (MONITOR)

- [ ] **MONITOR-01**: Ve sensores, drones y lecturas de sensor en tiempo (casi) real para los viñedos de su empresa
- [ ] **MONITOR-02**: Puede cambiar el estado de una alerta entre Pendiente/En Proceso/Resuelta

### Vista TI/Admin de servidores (TI)

- [ ] **TI-01**: Gestión de cuentas de usuario (alta/baja/reset básico) separada del panel de administración de negocio
- [ ] **TI-02**: Vista de configuración de sistema (al menos: estado de conexión a base de datos, variables de entorno activas sin exponer secretos)

### Monitoreo y Gráficos (STATS)

- [ ] **STATS-01**: Gráfico de tendencia de lecturas de sensor por viñedo/rango de fechas (extiende el uso actual de Recharts)
- [ ] **STATS-02**: Vista de comparación entre viñedos (alertas totales o lecturas fuera de umbral, por viñedo)

### Infraestructura (INFRA)

- [ ] **INFRA-01**: `docker-compose.yml` levanta correctamente los 3 servicios (db, app, web) — corrige el bloque `web` mal indentado fuera de `services:`

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
| SEC-01 | TBD | Pending |
| SEC-02 | TBD | Pending |
| SEC-03 | TBD | Pending |
| SEC-04 | TBD | Pending |
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| ADMIN-01 | TBD | Pending |
| ADMIN-02 | TBD | Pending |
| ADMIN-03 | TBD | Pending |
| CLIENTE-01 | TBD | Pending |
| CLIENTE-02 | TBD | Pending |
| MONITOR-01 | TBD | Pending |
| MONITOR-02 | TBD | Pending |
| TI-01 | TBD | Pending |
| TI-02 | TBD | Pending |
| STATS-01 | TBD | Pending |
| STATS-02 | TBD | Pending |
| INFRA-01 | TBD | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 0 (pending roadmap creation)
- Unmapped: 19 ⚠️ (expected before roadmap step)

---
*Requirements defined: 2026-07-05*
*Last updated: 2026-07-05 after initial definition*
