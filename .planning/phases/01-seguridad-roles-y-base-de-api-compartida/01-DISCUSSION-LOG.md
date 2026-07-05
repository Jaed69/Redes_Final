# Phase 1: Seguridad, Roles y Base de API Compartida - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-05
**Phase:** 1-Seguridad, Roles y Base de API Compartida
**Areas discussed:** Nombres de los 4 roles, requireRole — diseño del middleware, Enrutamiento y guardas en frontend, Cliente HTTP compartido (api.ts)

---

## Nombres de los 4 roles

| Option | Description | Selected |
|--------|-------------|----------|
| Nombres largos en español | 'Admin general', 'Cliente/Productor', 'Operador/Monitor de campo', 'TI' | |
| Códigos cortos | 'admin', 'cliente', 'monitor', 'ti' | ✓ |

**User's choice:** Códigos cortos
**Notes:** Etiquetas largas se usan solo en UI, mapeadas desde el código corto.

Follow-up — migración del seed:

| Option | Description | Selected |
|--------|-------------|----------|
| Migrar seed a 4 roles | Mapear 'Administrador'→'admin', asignar roles concretos a los 'Usuario' existentes (monitor, cliente), agregar ti | ✓ |
| Solo admin + un genérico | Todos los 'Usuario' → 'monitor', crear cliente/ti después manualmente | |
| No tocar seed ahora | Dejar init.sql como está | |

**User's choice:** Migrar seed a 4 roles

---

## requireRole — diseño del middleware

| Option | Description | Selected |
|--------|-------------|----------|
| Whitelist explícita por ruta | requireRole('admin') como middleware por endpoint, sigue patrón de verificarToken | ✓ |
| Mapa central de permisos | Objeto {ruta: [roles]} consultado por middleware genérico | |

**User's choice:** Whitelist explícita por ruta

Follow-up — alcance de rutas en esta fase:

| Option | Description | Selected |
|--------|-------------|----------|
| Solo mutaciones existentes hoy | requireRole('admin') en todo POST/PUT/DELETE actual (empresas, vinedos, sensores, drones, usuarios, umbrales); GET solo verificarToken | ✓ |
| Solo /empresas | Cumplir solo SEC-02 literal, resto para Fase 2 | |

**User's choice:** Solo mutaciones existentes hoy

---

## Enrutamiento y guardas en frontend

| Option | Description | Selected |
|--------|-------------|----------|
| Guard genérico por rol | <RequireRole rol="..."> envuelve cada rama de rutas; monitor/cliente/ti redirigen a placeholder si su fase no existe aún | ✓ |
| Redirect simple post-login solamente | Solo decide destino inicial, no bloquea navegación directa por URL | |

**User's choice:** Guard genérico por rol
**Notes:** `/admin/*` → admin, `/dashboard/*` (vistas de operador existentes) → monitor. Cliente y TI reciben vista placeholder "Próximamente" hasta sus fases (4 y 5).

---

## Cliente HTTP compartido (api.ts)

| Option | Description | Selected |
|--------|-------------|----------|
| Migrar todo ahora | Crear api.ts y reemplazar los fetch() de App.tsx en esta misma fase | ✓ |
| Solo crear el cliente | api.ts queda listo pero App.tsx sigue con fetch() actuales | |

**User's choice:** Migrar todo ahora

---

## Claude's Discretion

- Forma exacta de la interfaz de `api.ts` (métodos, manejo de headers/auth, tipado de respuestas).
- Estructura exacta del componente `<RequireRole>` y dónde vive en el árbol de archivos.
- Contenido exacto de la vista placeholder para cliente/ti.

## Deferred Ideas

None — discussion stayed within phase scope.
