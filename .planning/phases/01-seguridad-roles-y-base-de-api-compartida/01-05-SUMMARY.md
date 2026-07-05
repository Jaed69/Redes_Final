# 01-05 — Verificación Walking Skeleton (extendida)

## Resultado

`agrodroid/scripts/verify-walking-skeleton.sh` corre contra un stack `docker compose` recién-reconstruido (down -v + up -d --build) y pasa los 10 checks:

1. `docker compose up -d --build` levanta `db`/`app`/`web`.
2. `app` responde en `http://localhost:3000/` en ≤20 intentos.
3. Login de los 4 roles sembrados (admin/cliente/monitor/ti) → 200, todos verificados por el mismo `JWT_SECRET`, token capturado.
4. `POST /empresas` sin `Authorization` → 401.
5. `POST /empresas` con token `monitor` → 403.
6. `POST /empresas` con token `admin` + body válido → 201, retorna `idempresa` real.
7. `DELETE /empresas/:id` con token `admin` → 200 (fila insertada en paso 6 realmente borrada).
8. `PUT /alertas/1/estado` con token `monitor` y body `{"estado":"En Proceso"}` (string lookup) → 200 — prueba el patch de Phase 3 (roles `admin`+`monitor` + estado por nombre).
9. `POST /usuarios` con token `ti` + body completo (nombre/correo/contrasenia/rol/Empresa_idEmpresa) → 201 — prueba Phase 5 (crear usuario con TI).
10. `GET /system/status` con token `ti` → 200, body `db=ok`, ningún secreto expuesto (sólo flags `set`/`unset`).

Salida final: `WALKING SKELETON VERIFIED`.

## Extensiones aplicadas vs el plan original

- DELETEs reales en `empresa`/`vinedo`/`usuario`/`dron`/`sensor`/`umbral` con `requireRole("admin")` (y `"ti"` para usuario).
- `actualizarEstadoAlerta` acepta `estado` string (lookup en `EstadoAlerta`) además del legacy numérico `estadoalerta_idestado`.
- `auth.service.login` devuelve también `empresaId` + `empresaNombre` en `usuario`, para que Cliente/Monitor filtren por empresa.
- `/system/status` con `requireRole("admin","ti")` y servicio `system.service.js`.
- `obtenerDetecciones` ahora JOIN `tipoenfermedad` + `imagen` y devuelve `nombreenfermedad` + `rutaarchivo`.
- `obtenerAlertas` ahora JOIN empresa y devuelve `vinedo_idvinedo` + `nombreempresa`.
- Tipos `*Admin` del frontend recortados a los campos backend reales (sin `responsable`/`estado`/`bateria`/`modelo`/`tipo`).
- `mockData.ts` eliminado; `App.tsx` carga drones + lecturas + detecciones + alertas(vinedoId/empresaNombre) reales; `AlertsNotificationsView` permite a Monitor cambiar estado via `<select>`.
- Rutas nuevas `/cliente/*` y `/ti/*`; `Login.tsx` + `RequireRole` enrutan a su home por rol.
- `docker-compose.yml`: montaje en vivo de `web/src` y `./app:/app` (con `node_modules` anónimo) para dev en caliente.

## Checkpoint humano (Task 2 — pendiente de observador)

Resta verificación manual en navegador (6 chequeos de ruteo por rol). Ver `01-05-PLAN.md` Task 2. Script cubre la parte de API/backend; el behaviour de render/guard de rutas se confirma abriendo `http://localhost:5173/`.

## Credenciales sembradas (ya documentadas en 01-02-SUMMARY)

- admin@agrovina.com / admin123 → admin
- supervisor1@agrovina.com / clave123 → cliente
- operador1@agrovina.com / clave123 → monitor
- ti1@agrovina.com / ti123 → ti