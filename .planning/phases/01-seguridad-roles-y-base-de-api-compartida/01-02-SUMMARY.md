---
phase: 01-seguridad-roles-y-base-de-api-compartida
plan: 2
subsystem: infra
tags: [docker-compose, dotenv, bcrypt, postgres, seed-data]

# Dependency graph
requires: ["01-01: process.env.JWT_SECRET consumed by auth.middleware.js/auth.service.js"]
provides:
  - "agrodroid/.env (gitignored) as the single source of DB/JWT credential values for docker-compose.yml"
  - "agrodroid/.env.example as the committed placeholder template for a fresh clone"
  - "docker-compose.yml web service correctly nested under services: (3 containers start)"
  - "4 seeded Usuario rows (admin/cliente/monitor/ti) each with a bcrypt-hashed, bcrypt.compare-verified contrasenia"
affects: ["01-05", "admin-phase", "monitor-phase", "cliente-phase", "ti-phase"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "docker-compose.yml services reference ${VAR_NAME} interpolation; Compose auto-loads agrodroid/.env sitting next to the compose file (no env_file: directive needed)"

key-files:
  created:
    - agrodroid/.env
    - agrodroid/.env.example
    - agrodroid/.gitignore
  modified:
    - agrodroid/docker-compose.yml
    - agrodroid/db/init.sql

key-decisions:
  - "Relocated existing dev credential values verbatim into .env rather than rotating them — this is a local dev environment, not production; goal was removing them from git tracking, not generating new secrets"
  - "Reused the same bcrypt hash for supervisor1/operador1's shared plaintext (clave123) rather than computing a second hash for the identical password, matching the plan's explicit instruction"
  - "Row 1-3 nombreUsuario/correo/Empresa_idEmpresa values and insertion order left unchanged so Notificacion's existing Usuario_idUsuario references (1, 2) still point at the same logical users"

requirements-completed: [SEC-03, INFRA-01, AUTH-01]

coverage:
  - id: D1
    description: "docker-compose.yml contains zero plaintext credential values; every DB/JWT value is ${VAR} interpolated from agrodroid/.env"
    requirement: "SEC-03"
    verification:
      - kind: unit
        ref: "grep -c '${JWT_SECRET}' and '${POSTGRES_PASSWORD}' docker-compose.yml (both = 1), agrodroid/.env untracked per git status"
        status: pass
    human_judgment: false
  - id: D2
    description: "web service block nested correctly under services:; docker compose config resolves exactly 3 services"
    requirement: "INFRA-01"
    verification:
      - kind: unit
        ref: "docker compose config --services returned db, app, web"
        status: pass
    human_judgment: false
  - id: D3
    description: "Usuario seed covers exactly the 4 role codes admin/cliente/monitor/ti, each with a bcrypt-hashed contrasenia bcrypt.compare can validate"
    requirement: "AUTH-01"
    verification:
      - kind: unit
        ref: "grep -c '\\$2b\\$10\\$' init.sql (= 4); node bcrypt.compareSync against all 3 distinct plaintexts (all true)"
        status: pass
      - kind: integration
        ref: "docker compose up -d db; psql SELECT nombreusuario, rol FROM usuario — returned exactly 4 rows with admin/cliente/monitor/ti"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-07-05
status: complete
---

# Phase 01 Plan 2: Docker-Compose Credential Externalization + 4-Role Seed Migration Summary

**Moved all DB/JWT credentials out of docker-compose.yml into a gitignored .env, fixed the malformed web service nesting, and migrated the Usuario seed to 4 bcrypt-hashed role logins (admin/cliente/monitor/ti) — verified end-to-end against a live Postgres container.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-07-05
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- Created `agrodroid/.gitignore` (did not exist anywhere in the repo) excluding `.env`
- Created `agrodroid/.env` with the exact existing dev credential values relocated from `docker-compose.yml` (not rotated — dev-only secrets)
- Created `agrodroid/.env.example` with placeholder values as the committed onboarding template
- Replaced every hardcoded credential in `docker-compose.yml`'s `db`/`app` `environment:` blocks with `${VAR}` interpolation
- Fixed the `web` service block's indentation bug (was a 0-indent sibling of `services:`, silently never starting) — now correctly nested at 2-space indent alongside `db` and `app`
- Verified with `docker compose config` (resolves exactly 3 services: db, app, web) and a live `docker compose up -d db` bring-up
- Migrated the 3-row plaintext `Usuario` seed to 4 rows with real bcrypt (cost 10) hashes and short role codes (`admin`, `cliente`, `monitor`, `ti`), preserving rows 1-3's `nombreUsuario`/`correo`/id so `Notificacion`'s existing `Usuario_idUsuario` FK references (1, 2) still resolve correctly
- Verified all 3 distinct seeded hashes with `bcrypt.compareSync` against their plaintexts using the actual `bcrypt` package in `agrodroid/app/node_modules`, then re-verified live via `psql` after a real `docker compose up -d db` bring-up

## Task Commits

Each task was committed atomically:

1. **Task 1: Move docker-compose credentials to .env and fix the web service indentation bug** - `5e112c0` (fix)
2. **Task 2: Migrate Usuario seed data to the 4 role codes with bcrypt-hashed passwords** - `9d74861` (fix)

**Plan metadata:** (pending — recorded in final commit)

## Files Created/Modified
- `agrodroid/.gitignore` - new file, excludes `.env`
- `agrodroid/.env` - new file (gitignored), real dev credential values relocated from docker-compose.yml
- `agrodroid/.env.example` - new file (committed), placeholder template for all 9 env vars
- `agrodroid/docker-compose.yml` - `db`/`app` environment blocks now `${VAR}` interpolated; `web` service re-indented under `services:`
- `agrodroid/db/init.sql` - `Usuario` seed INSERT: 3 plaintext rows → 4 bcrypt-hashed rows with role codes admin/cliente/monitor/ti

## Decisions Made
- Credential values relocated verbatim (not rotated) — this is local dev tooling, not production; SEC-03's scope is "get these out of git", not "generate new secrets"
- Reused the identical bcrypt hash for the two `clave123` rows (supervisor1, operador1) rather than computing a distinct hash for the same plaintext, per the plan's explicit instruction
- Left seed row order and ids 1-3 untouched so `Notificacion`'s FK references by `Usuario_idUsuario` (1, 2) keep resolving to the same logical users

## Credential Pairs for Plan 01-05 (4-role login testing)

| Role | correo | contrasenia (plaintext) | nombreUsuario |
|------|--------|--------------------------|----------------|
| admin | admin@agrovina.com | admin123 | admin |
| cliente | supervisor1@agrovina.com | clave123 | supervisor1 |
| monitor | operador1@agrovina.com | clave123 | operador1 |
| ti | ti1@agrovina.com | ti123 | ti1 |

## Deviations from Plan

None - plan executed exactly as written. Both tasks' automated verification commands passed on first attempt; additionally ran a live `docker compose up -d db` + `psql SELECT` bring-up beyond the plan's minimum automated check to confirm the seed data and hashes work end-to-end (not just statically), then tore the container back down.

## Issues Encountered
None. `docker compose config` resolved cleanly; the pre-existing `version: '3.9'` obsolescence warning from Compose is out of scope for this plan (not part of the credential/indentation/seed fixes requested) and left untouched.

## User Setup Required
None for this plan's own scope. Note for anyone cloning fresh: `agrodroid/.env` must be created locally (copy `agrodroid/.env.example` and fill in real values) before `docker compose up` will resolve credentials — this is now documented by the `.env.example` file itself.

## Next Phase Readiness
- Plan 01-05 can now log in as all 4 roles using the credential pairs table above to exercise `requireRole` (established in 01-01) end-to-end with real, distinct role tokens
- `docker compose up` (run from `agrodroid/`) starts all 3 containers (`db`, `app`, `web`) without config errors — INFRA-01 unblocked for any plan needing the full stack running
- `.env`/`.env.example` pattern is now established for this repo; any future new env var should be added to both files together

---
*Phase: 01-seguridad-roles-y-base-de-api-compartida*
*Completed: 2026-07-05*

## Self-Check: PASSED
