# Agrodroid MVP

## What This Is

Agrodroid es una aplicación web de monitoreo agrícola para viñedos (sensores de campo, drones, detección de enfermedades, alertas) con backend Express/PostgreSQL y frontend React/Vite. El repo también contiene un ejercicio de VLSM/Packet Tracer para el curso de Redes, que es documentación de sustento (informe TB1) y no forma parte del alcance de desarrollo de este proyecto GSD. Este proyecto lleva agrodroid de "CRUD parcialmente conectado + panel admin con datos mock" a un MVP funcional con roles reales, seguridad corregida y monitoreo/gráficos consistentes, para una entrega de curso con fecha cercana.

## Core Value

Un usuario de cada uno de los 4 perfiles (Admin general, Cliente/productor, Operador/Monitor de campo, TI) puede iniciar sesión y ver/operar exactamente lo que su rol permite, sobre datos reales de la base de datos (no mock), sin huecos de seguridad conocidos.

## Requirements

### Validated

- ✓ Backend REST (Express + pg, sin ORM) con rutas/controladores/servicios por recurso — existente
- ✓ Schema PostgreSQL completo (Empresa, Vinedo, Sensor, Dron, LecturaSensor, Umbral, DeteccionEnfermedad, Alerta, Notificacion, Usuario) — existente
- ✓ Auth JWT + bcrypt (login/register) — existente, pero con secreto hardcodeado (ver Constraints)
- ✓ Vistas de Usuario conectadas a la API real: dashboard, mapa de sensores (Leaflet), lecturas (Recharts), drones, detección de enfermedades, alertas — existente
- ✓ Despliegue con Docker Compose (db + app) — existente

### Active

- [ ] Sistema de roles con 4 perfiles: Admin general (empresa), Cliente/Productor (solo lectura), Operador/Monitor de campo, TI/admin de servidores
- [ ] Autorización por rol en middleware/rutas del backend (no solo autenticación)
- [ ] Panel Admin conectado a la API real (hoy usa `mockData.ts` exclusivamente — Empresa/Vinedo/Sensor/Dron/Umbral/Usuario CRUD)
- [ ] Vista de Cliente/Productor: solo lectura, ve todos los viñedos de su empresa (dashboard, alertas, reportes)
- [ ] Vista de Operador/Monitor de campo: sensores/drones/lecturas en tiempo real + cambio de estado de alertas (Pendiente/En Proceso/Resuelta)
- [ ] Vista de TI/admin de servidores: gestión de cuentas de usuario, configuración de sistema — separada de la administración de negocio
- [ ] Gestión de umbrales (Umbral: min/max por sensor) desde UI, conectado a API real
- [ ] Gráficos estadísticos ampliados (tendencias por viñedo/sensor, más allá del historial simple actual)
- [ ] Corregir secreto JWT hardcodeado (duplicado en `auth.service.js` y `auth.middleware.js`, ignora `JWT_SECRET` de env)
- [ ] Autenticar `POST /empresas` (hoy sin `verificarToken`)
- [ ] Mover credenciales de `docker-compose.yml` a variables de entorno/`.env` (hoy en texto plano)
- [ ] Cliente API centralizado en frontend (`services/api.ts` existe pero vacío; URL base hardcodeada a `localhost:3000` en varios archivos)
- [ ] Corregir bug de indentación en `docker-compose.yml` (bloque `web` fuera de `services:`, no se levanta)

### Out of Scope

- Integración real con Vertex AI / visión computacional para detección de plagas — la detección de enfermedades se mantiene simulada/con datos ya insertados manualmente, no se conecta a un servicio de IA real en este MVP
- Ingesta real desde drones DJI Mavic 3 / procesamiento de imágenes en vivo — fuera de alcance de software, es infraestructura de campo descrita en el informe TB1
- Despliegue en Google Cloud (Vertex AI, BigQuery, Pub/Sub, Looker Studio) — el informe lo evalúa como justificación teórica; el MVP corre local/Docker
- Ejercicio VLSM / topología Packet Tracer — ya entregado, documentación de sustento, no requiere desarrollo
- Autenticación multi-tenant por viñedo individual (Usuario_Vinedo) — Cliente/Productor ve todos los viñedos de su empresa, no un subconjunto asignado

## Context

- Proyecto final del curso "Redes y Protocolos de Comunicación" (UPC) — el informe TB1 ya entregado sustenta la elección de stack/nube/arquitectura de red; agrodroid es la aplicación resultante que debe llegar a MVP funcional para evaluación.
- Codebase mapeado en `.planning/codebase/` (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS) — brownfield, sin tests, sin CI.
- El repo tuvo un merge reciente (commits `6d89660`, `47015e3`) que agregó todo el panel Admin (`agrodroid/web/src/pages/Admin/*`, `modals/*`, `mockData.ts`) — confirmado por grep de imports que es 100% mock, ninguna vista Admin llama a `fetch` ni a `services/api.ts`.
- `Usuario.rol` en la base de datos es `varchar` libre (hoy solo "Administrador"/"Usuario") — necesita mapear a los 4 roles nuevos, probablemente vía enum/check constraint o tabla de roles.
- No existe tabla `Usuario_Vinedo`; el filtro de "Cliente ve todos los viñedos de su empresa" se resuelve con el `Empresa_idEmpresa` que ya existe en `Usuario`.

## Constraints

- **Fecha límite**: Entrega de curso cercana — priorizar MVP mínimo funcional por rol antes que pulido/cobertura exhaustiva.
- **Stack fijo**: Node.js/Express/pg (backend), React 19/Vite/TS (frontend), PostgreSQL 16, Docker Compose — no cambiar de stack, solo corregir y completar.
- **Sin tests existentes**: no hay framework de testing instalado en `app/` ni `web/`; agregar cobertura mínima es discrecional del planner, no bloqueante para el MVP.
- **Seguridad**: JWT secret y credenciales de DB deben salir de texto plano/hardcode antes de considerar el MVP "seguro" (parte explícita del alcance pedido).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sin integración real de IA/Vertex AI en este MVP | El informe TB1 la justifica en teoría, pero el código actual no tiene pipeline de imágenes real; conectar Vertex AI ahora excede el tiempo disponible antes de la entrega | — Pending |
| Cliente/Productor ve todos los viñedos de su empresa (no asignación por viñedo) | Evita crear tabla `Usuario_Vinedo` nueva; usa el `Empresa_idEmpresa` ya existente en `Usuario` | — Pending |
| Corregir seguridad (JWT hardcodeado, endpoint sin auth, secretos en compose) como parte del MVP | El usuario lo pidió explícitamente al ver `CONCERNS.md`; dejarlo roto contradice el objetivo de "seguridad" del MVP | — Pending |
| Panel Admin se conecta a API real, dejando de usar `mockData.ts` | El panel Admin ya existe visualmente pero no sirve como MVP funcional si no persiste en la base de datos real | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-05 after initialization*
