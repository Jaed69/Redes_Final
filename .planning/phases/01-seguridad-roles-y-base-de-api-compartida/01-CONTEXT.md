# Phase 1: Seguridad, Roles y Base de API Compartida - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Corregir la base insegura/sin roles del backend y frontend, y entregar el cliente HTTP compartido y el enrutamiento por rol que toda fase siguiente necesita:
- JWT firmado desde `process.env.JWT_SECRET` en un único punto de verdad (auth.service.js y auth.middleware.js coinciden).
- Credenciales de DB y JWT movidas a `.env` (ignorado por git), fuera de `docker-compose.yml`.
- `docker-compose.yml` levanta `db`, `app`, `web` correctamente (bloque `web` mal indentado corregido).
- 4 roles reales (`admin`, `cliente`, `monitor`, `ti`) soportados por `Usuario.rol`, login y frontend.
- Middleware `requireRole(...)` bloqueando mutaciones según rol.
- Enrutamiento por rol en frontend con guard que impide navegación cruzada por URL directa.
- Cliente HTTP compartido (`services/api.ts`) con base URL desde variable de entorno, usado por todas las vistas existentes.

No incluye: CRUD real de Admin contra datos reales (Fase 2), vistas propias para Monitor/Cliente/TI más allá de placeholders (Fases 3-5).

</domain>

<decisions>
## Implementation Decisions

### Nombres de roles
- **D-01:** Los 4 roles usan códigos cortos como valor de `Usuario.rol` y como claim `rol` en el JWT: `admin`, `cliente`, `monitor`, `ti`. Las etiquetas largas del roadmap (Admin general, Cliente/Productor, Operador/Monitor de campo, TI) se usan solo como texto de UI, mapeadas desde el código corto.
- **D-02:** El seed de `agrodroid/db/init.sql` se migra a los 4 roles: `Administrador` → `admin`; de los usuarios `Usuario` existentes, asignar roles concretos (ej. uno `monitor`, uno `cliente`) para poder probar los 4 flujos de login desde esta fase. Agregar también un usuario `ti` si no existe ninguno con ese perfil.

### requireRole — middleware y alcance de rutas
- **D-03:** `requireRole(...roles)` se implementa como middleware de segundo nivel por ruta (después de `verificarToken`), whitelist explícita: `router.post('/recurso', verificarToken, requireRole('admin'), controller.crear)`. Sigue el patrón existente de `verificarToken` — explícito y auditable por endpoint, sin mapa central de permisos.
- **D-04:** En esta fase, `requireRole('admin')` se aplica a **todas** las mutaciones (POST/PUT/DELETE) que ya existen en las rutas actuales (empresas, vinedos, sensores, drones, usuarios, umbrales), aunque el Admin panel todavía no las invoque de verdad (eso es Fase 2). Las rutas GET solo requieren `verificarToken`. Esto deja el middleware listo y probado antes de que Fase 2 dependa de él.

### Enrutamiento y guardas en frontend
- **D-05:** Se implementa un wrapper genérico `<RequireRole rol="...">` (o `roles={[...]}`) que envuelve cada rama de rutas por rol. `/admin/*` requiere rol `admin`; `/dashboard/*` (vistas existentes de operador: mapa, lecturas, drones, enfermedades, alertas) requiere rol `monitor`, ya que esas vistas son las que Fase 3 (Monitor de Campo) expandirá.
- **D-06:** Los roles `cliente` y `ti` no tienen vistas propias todavía (Fases 4 y 5). Login para esos roles redirige a una vista placeholder mínima ("Próximamente") en vez de fallar o mostrar una pantalla en blanco. El guard bloquea el acceso cruzado por URL directa desde el día uno, sin esperar a que existan las fases 3-5.

### Cliente HTTP compartido (api.ts)
- **D-07:** `services/api.ts` se implementa y se migra en esta misma fase: todos los `fetch()` directos en `App.tsx` (vinedos, sensores, lecturas, drones, detecciones, alertas, notificaciones) pasan a usar el cliente centralizado con base URL desde `import.meta.env.VITE_API_URL` (con fallback a `http://localhost:3000` si no está definida). Establece el único patrón que Fase 2 (Admin) reutilizará al conectar contra datos reales.

### Claude's Discretion
- Forma exacta de la interfaz de `api.ts` (métodos `get/post/put/del`, manejo de headers/auth, forma de tipar respuestas) — el researcher/planner decide la implementación concreta.
- Estructura exacta del componente `<RequireRole>` (dónde vive, cómo lee el usuario/rol de localStorage) — implementación queda a criterio del planner, siguiendo patrones ya vistos en `App.tsx`.
- Contenido exacto de la vista placeholder para `cliente`/`ti`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos y roadmap
- `.planning/REQUIREMENTS.md` — SEC-01 a SEC-04, AUTH-01 a AUTH-03, INFRA-01, ADMIN-02 (requisitos exactos de esta fase)
- `.planning/ROADMAP.md` §Phase 1 — goal y success criteria completos

### Código existente relevante
- `agrodroid/app/middlewares/auth.middleware.js` — JWT hardcodeado a corregir
- `agrodroid/app/services/auth.service.js` — JWT hardcodeado (duplicado) + login/register
- `agrodroid/app/routes/*.js` — rutas actuales a las que aplicar `requireRole`
- `agrodroid/db/init.sql` — schema `Usuario.rol` y seed a migrar
- `agrodroid/docker-compose.yml` — credenciales en texto plano + bloque `web` mal indentado
- `agrodroid/web/src/App.tsx` — fetch() directos a migrar a `api.ts`, rutas actuales (`/dashboard`, `/admin`)
- `agrodroid/web/src/services/api.ts` — stub vacío, punto de implementación del cliente HTTP
- `agrodroid/web/src/pages/Auth/Login.tsx` — redirect por rol actual (hardcodeado a "Administrador")

No hay ADRs/specs externos para esta fase — requisitos capturados en REQUIREMENTS.md y las decisiones arriba.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Patrón `verificarToken` en `auth.middleware.js`: modelo a seguir para `requireRole` (mismo estilo de middleware, mismo lugar en la cadena de rutas).
- `AdminLayout`/`AdminNavbar` y `AppLayout`/`navbar` ya existen como shells separados por perfil — el guard por rol se monta alrededor de estos, no reemplaza su estructura.

### Established Patterns
- Rutas: `<recurso>.routes.js` requiere `express`, controller y `auth.middleware` — nuevo `requireRole` se importa igual.
- Errores backend: `try/catch` con `console.error` + `res.status(...).json({ mensaje })` — mantener en cualquier código nuevo de auth.

### Integration Points
- `services/api.ts` es el punto de integración entre el cliente HTTP nuevo y tanto las vistas de Usuario (ya con fetch) como el Admin panel (Fase 2, sin fetch todavía).
- `localStorage` (`usuario`, `token`) sigue siendo la fuente de sesión — el guard de rol lee de ahí, no se introduce un store nuevo.

</code_context>

<specifics>
## Specific Ideas

Ninguna referencia visual o de comportamiento específica más allá de las decisiones ya capturadas — implementación abierta dentro de esos límites.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Seguridad, Roles y Base de API Compartida*
*Context gathered: 2026-07-05*
