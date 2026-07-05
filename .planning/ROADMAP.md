# Roadmap: Agrodroid MVP

## Overview

Agrodroid goes from "CRUD parcialmente conectado + panel admin con datos mock" a un MVP funcional de 4 roles reales. La secuencia empieza por la base insegura/sin roles que bloquea todo lo demás (secretos hardcodeados, sin autorización por rol, Admin panel sin API, docker-compose roto), la corrige y entrega en el mismo movimiento el cliente HTTP compartido y el enrutamiento por rol. Con esa base sólida, cada fase siguiente entrega una porción vertical completa para un rol: Admin (CRUD real), Monitor de campo (tiempo real + alertas + tendencias), Cliente/Productor (solo lectura + comparativas) y TI (cuentas + estado del sistema). Ninguna fase deja al usuario de ese rol a medio camino.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Seguridad, Roles y Base de API Compartida** - Secretos y autorización corregidos, 4 roles definidos, enrutamiento por rol y cliente HTTP centralizado — la base que todo lo demás necesita
- [ ] **Phase 2: Panel Admin — Datos Reales** - El panel Admin deja de usar `mockData.ts` y opera contra la base de datos real
- [ ] **Phase 3: Monitor de Campo — Tiempo Real y Alertas** - El operador/monitor ve sensores/drones/lecturas en vivo y gestiona el ciclo de vida de las alertas
- [ ] **Phase 4: Cliente/Productor — Vista de Solo Lectura y Reportes** - El productor ve todos los viñedos de su empresa y compara desempeño, sin poder mutar nada
- [ ] **Phase 5: TI — Cuentas y Configuración de Sistema** - TI administra cuentas de usuario y consulta el estado del sistema, separado del panel de negocio

## Phase Details

### Phase 1: Seguridad, Roles y Base de API Compartida
**Goal**: Todo login emite un token firmado correctamente y consciente del rol, contra un backend asegurado, y la app enruta cada uno de los 4 roles a su propio espacio usando un único cliente de API compartido en el frontend — la base sobre la que se construye cada fase siguiente.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, AUTH-01, AUTH-02, AUTH-03, INFRA-01, ADMIN-02
**Success Criteria** (what must be TRUE):
  1. Un usuario inicia sesión y recibe un JWT firmado con el secreto de `JWT_SECRET` (env), idéntico sin importar si lo verifica `auth.service.js` o `auth.middleware.js`.
  2. `docker compose up` levanta los contenedores `db`, `app` y `web` correctamente, con credenciales de DB y JWT leídas desde un `.env` ignorado por git en vez de estar en el compose file.
  3. Tras iniciar sesión, el usuario es enrutado a la vista de su rol (Admin general, Cliente/Productor, Operador/Monitor, TI) y no puede alcanzar rutas/menús de otro rol navegando directamente.
  4. Crear una empresa (`POST /empresas`) sin token válido es rechazado, y un usuario autenticado que intenta una mutación fuera de los permisos de su rol recibe 403.
  5. Todas las llamadas de red del frontend (vistas de operador existentes y, en adelante, vistas Admin) pasan por un único cliente de API con base URL configurable, no strings `localhost:3000` hardcodeados.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Panel Admin — Datos Reales
**Goal**: Los usuarios Admin general administran Empresa, Viñedo, Sensor, Dron, Umbral y Usuario contra la base de datos real — el panel deja de ser un prototipo con datos mock.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: ADMIN-01, ADMIN-03
**Success Criteria** (what must be TRUE):
  1. Crear, editar o eliminar un registro en cualquier vista Admin (Empresa, Viñedo, Sensor, Dron, Usuario) persiste en Postgres y sobrevive a un refresh de página.
  2. Las tarjetas de estadísticas del dashboard Admin reflejan conteos en vivo consultados a la base de datos, no `mockData.ts`.
  3. Un usuario Admin puede crear/actualizar el Umbral (mín/máx) de un sensor desde la UI y verlo reflejado al leerlo de la tabla `Umbral`.
  4. Ninguna vista o modal de Admin importa desde `mockData.ts`.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Monitor de Campo — Tiempo Real y Alertas
**Goal**: Los usuarios Operador/Monitor de campo siguen las condiciones de campo en vivo y resuelven alertas para los viñedos de su empresa.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: MONITOR-01, MONITOR-02, STATS-01
**Success Criteria** (what must be TRUE):
  1. Un usuario con rol Monitor ve sensores, drones y lecturas recientes acotados a los viñedos de su empresa, actualizándose sin recargar la página completa.
  2. Un usuario con rol Monitor puede cambiar el estado de una alerta entre Pendiente, En Proceso y Resuelta, y el cambio queda guardado.
  3. Un usuario con rol Monitor puede graficar la tendencia de lecturas de un sensor para un viñedo y rango de fechas elegidos.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Cliente/Productor — Vista de Solo Lectura y Reportes
**Goal**: Los usuarios Cliente/Productor obtienen una vista completa de solo lectura de los viñedos de su empresa, sin poder modificar nada.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: CLIENTE-01, CLIENTE-02, STATS-02
**Success Criteria** (what must be TRUE):
  1. Un usuario con rol Cliente ve un dashboard, alertas y reportes que cubren todos los viñedos bajo su propio `Empresa_idEmpresa`, y nada fuera de ese conjunto.
  2. Un usuario con rol Cliente puede comparar los viñedos de su empresa por alertas totales o por lecturas fuera de umbral.
  3. Ningún control de crear/editar/eliminar es visible ni alcanzable en ninguna parte de la app para un usuario con rol Cliente.
**Plans**: TBD
**UI hint**: yes

### Phase 5: TI — Cuentas y Configuración de Sistema
**Goal**: Los usuarios TI administran cuentas de usuario y revisan la salud del sistema, de forma independiente al panel Admin de negocio.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: TI-01, TI-02
**Success Criteria** (what must be TRUE):
  1. Un usuario con rol TI puede crear, dar de baja y resetear una cuenta de usuario desde una vista dedicada de TI, separada del panel Admin.
  2. Un usuario con rol TI puede ver el estado de conectividad a la base de datos y qué variables de entorno están activas, sin que se muestre ningún valor de secreto.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Seguridad, Roles y Base de API Compartida | 0/TBD | Not started | - |
| 2. Panel Admin — Datos Reales | 0/TBD | Not started | - |
| 3. Monitor de Campo — Tiempo Real y Alertas | 0/TBD | Not started | - |
| 4. Cliente/Productor — Vista de Solo Lectura y Reportes | 0/TBD | Not started | - |
| 5. TI — Cuentas y Configuración de Sistema | 0/TBD | Not started | - |
