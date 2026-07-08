# AGENTS.md — Agrodroid

Repo de proyecto final Redes (UPC). App real: `agrodroid/`. Raíz tiene `Parcila_redes.pkt`, `VLSM Automatico.*`, `DESIGN.md` — sustento TB1 (VLSM/Packet Tracer), no runtime. No editar como código.

## Run

```bash
cd agrodroid
docker compose up -d --build
# web http://localhost:5173 · api http://localhost:3000 · db :5432
```

Hot reload: compose monta `./web/src` y `./app:/app` (node_modules anónimo). Cambios TS/JS se reflejan sin rebuild.

## Verify & Reset

```bash
bash agrodroid/scripts/verify-walking-skeleton.sh   # debe terminar: WALKING SKELETON VERIFIED (10/10 PASS)
```

Reseed completo (limpia volumen Postgres, recarga `db/init.sql`):

```bash
cd agrodroid && docker compose down -v && docker compose up -d --build
```

No hay framework de tests, no hay CI. El script anterior es la única verificación end-to-end.

## Lint / Typecheck

Solo frontend (`agrodroid/web`):

```bash
cd agrodroid/web
npm run lint      # eslint flat config (ts, react-hooks, react-refresh)
npm run build    # tsc -b && vite build — tsconfig con noUnusedLocals/noUnusedParameters, edición debe quedar limpia
```

Backend (`agrodroid/app`) no tiene lint ni formatter. JS CommonJS, indent 4 espacios.

## Env

`agrodroid/.env` gitignored. Plantilla en `agrodroid/.env.example` (placeholders `changeme_dev_only`). Valores dev reales documentados en README. `docker-compose.yml` los inyecta vía `environment:`. `JWT_SECRET` se lee de `process.env` (antes hardcoded, ya corregido).

Frontend: `VITE_API_URL` opcional (default `http://localhost:3000`), respeta `services/api.ts`.

## Arquitectura

- Backend Express 3-tier por recurso: `routes/<recurso>.routes.js` → `controllers/<recurso>.controller.js` → `services/<recurso>.service.js`. Sin ORM, SQL crudo vía `pool.query()` (`config/db.js`). Entry: `app/server.js` monta 13 routers + Swagger UI en `/api-docs`.
- Frontend React 19/Vite. Router 7. Cliente HTTP único `services/api.ts`. Mapas Leaflet 1.9, gráficos Recharts 3.9. Entry: `web/src/main.tsx` → `App.tsx`.
- DB PostgreSQL 16. Schema+seed en `db/init.sql`.

## Convenciones backend

- Identificadores, respuestas JSON, comentarios, columnas DB: **español** (`usuario`, `vinedo`, `mensaje`, `contrasenia`).
- Columnas DB lowercase sin separador (`idusuario`, `empresa_idempresa`) — folding Postgres, no convención JS. Controllers destructure en camelCase (`nombreUsuario`).
- Nombres CRUD: `listar*`, `obtener*`, `crear*`/`registrar*`, `actualizar*`, `eliminar*`.
- Cada controller envuelve service en `try { ... } catch (error) { console.error(error); res.status(...).json({ mensaje: ... }) }`. Replicar exacto en endpoints nuevos.
- Services lanzan `new Error("mensaje español")` solo para errores de validación/negocio seguros de exponer; infra errores → mensaje genérico en controller.

## Convenciones frontend

- Tipos centralizados en `src/types/models.ts`: patrón `ApiX` (raw API shape) + `X` (dominio) + `mapX` (converter). Mantener patrón al añadir recursos.
- Páginas agrupadas por rol: `pages/{Auth,Admin,Usuario,Cliente,TI}/`. CSS espejo bajo `styles/`, un `.css` por componente, import último.
- Imports relativos (sin path aliases). `import type` para type-only. Indent 2 espacios.
- Errores UI via `alert()` — no hay toast system.

## Auth

4 roles: `admin`, `monitor`, `cliente`, `ti`. Backend: `verificarToken` en toda ruta protegida, `requireRole(...)` en cada mutación. Frontend: `RequireRole` guard bloquea cross-role por URL.

Creds dev sembradas en `db/init.sql` (bcrypt), todas empresa id 1 (AgroVina SAC). Documentadas en README. Para probar aislamiento entre empresas: crear segunda empresa desde Admin.

## GSD & .claude/CLAUDE.md

Repo usa GSD (ver `.planning/`, `skills-lock.json`). Workflow: `/gsd-quick`, `/gsd-debug`, `/gsd-execute-phase`. `.planning/config.json`: `mode: yolo`, `commit_docs: true` (fases auto-avanzan, artefactos planning se commitean).

`.claude/CLAUDE.md` gestionado por GSD — **stale**. Sus secciones STACK/ARCHITECTURE/CONVENTIONS describen estado pre-MVP (`mockData.ts`, `api.ts` vacío, JWT hardcoded, bug indent docker). Todo corregido. **Confiar en README + código vivo sobre CLAUDE.md.**