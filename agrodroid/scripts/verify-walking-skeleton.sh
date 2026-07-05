#!/usr/bin/env bash
# Phase 01 walking-skeleton verification.
#
# Proves, against a freshly-rebuilt `docker compose` stack, that:
#   - all 4 seeded roles (admin/cliente/monitor/ti) can log in and receive a JWT
#     verified by the single process.env.JWT_SECRET (SEC-01, AUTH-01, INFRA-01)
#   - POST /empresas is 401 with no token, 403 with a non-admin token, and 201
#     (a real inserted row) with an admin token (SEC-02, SEC-04)
#
# Re-runnable: safe to execute again before shipping later phases.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGRODROID_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
API_BASE="http://localhost:3000"

pass() { printf 'PASS: %s\n' "$1"; }
fail() { printf 'FAIL: %s\n' "$1" >&2; exit 1; }

cd "${AGRODROID_DIR}"

# ---------------------------------------------------------------------------
# Step 1: fresh stack (down -v so the seed migration actually re-runs)
# ---------------------------------------------------------------------------
echo "== Step 1: rebuilding docker compose stack (down -v && up -d --build) =="
docker compose down -v || true
docker compose up -d --build
pass "docker compose up -d --build issued"

# ---------------------------------------------------------------------------
# Step 2: wait for the app container to respond
# ---------------------------------------------------------------------------
echo "== Step 2: waiting for app container (${API_BASE}) =="
APP_UP=0
for i in $(seq 1 20); do
    if curl -sf "${API_BASE}/" >/dev/null 2>&1; then
        APP_UP=1
        break
    fi
    sleep 2
done

if [ "${APP_UP}" -ne 1 ]; then
    fail "app container never responded at ${API_BASE}/ after 20 attempts"
fi
pass "app container responded at ${API_BASE}/"

# ---------------------------------------------------------------------------
# Step 3: log in as all 4 seeded roles, assert rol + capture token
# ---------------------------------------------------------------------------
echo "== Step 3: logging in as all 4 seeded roles =="

login_and_check() {
    local correo="$1"
    local contrasenia="$2"
    local expected_rol="$3"
    local var_name="$4"

    local body
    body=$(curl -s -X POST "${API_BASE}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"correo\":\"${correo}\",\"contrasenia\":\"${contrasenia}\"}")

    local status
    status=$(curl -s -o /dev/null -w '%{http_code}' -X POST "${API_BASE}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"correo\":\"${correo}\",\"contrasenia\":\"${contrasenia}\"}")

    if [ "${status}" != "200" ]; then
        fail "login for ${correo} returned HTTP ${status} (expected 200): ${body}"
    fi

    local actual_rol
    actual_rol=$(printf '%s' "${body}" | node -e '
        let data = "";
        process.stdin.on("data", d => data += d);
        process.stdin.on("end", () => {
            try {
                const parsed = JSON.parse(data);
                process.stdout.write(String(parsed.usuario.rol));
            } catch (e) {
                process.stdout.write("");
            }
        });
    ')

    if [ "${actual_rol}" != "${expected_rol}" ]; then
        fail "login for ${correo} returned rol='${actual_rol}' (expected '${expected_rol}')"
    fi

    local token
    token=$(printf '%s' "${body}" | node -e '
        let data = "";
        process.stdin.on("data", d => data += d);
        process.stdin.on("end", () => {
            try {
                const parsed = JSON.parse(data);
                process.stdout.write(String(parsed.token));
            } catch (e) {
                process.stdout.write("");
            }
        });
    ')

    if [ -z "${token}" ] || [ "${token}" = "undefined" ]; then
        fail "login for ${correo} did not return a token"
    fi

    eval "${var_name}=\"${token}\""
    pass "login ${correo} -> rol=${actual_rol}, token acquired"
}

login_and_check "admin@agrovina.com" "admin123" "admin" TOKEN_ADMIN
login_and_check "supervisor1@agrovina.com" "clave123" "cliente" TOKEN_CLIENTE
login_and_check "operador1@agrovina.com" "clave123" "monitor" TOKEN_MONITOR
login_and_check "ti1@agrovina.com" "ti123" "ti" TOKEN_TI

pass "all 4 roles authenticated through the single shared JWT_SECRET"

# ---------------------------------------------------------------------------
# Step 4: POST /empresas with no Authorization header -> 401
# ---------------------------------------------------------------------------
echo "== Step 4: POST /empresas with no token (expect 401) =="

VALID_BODY='{"ruc":"99887766554","nombreEmpresa":"Verificacion Walking Skeleton SAC","direccion":"Lima, Peru"}'

STATUS_NO_AUTH=$(curl -s -o /dev/null -w '%{http_code}' -X POST "${API_BASE}/empresas" \
    -H "Content-Type: application/json" \
    -d "${VALID_BODY}")

if [ "${STATUS_NO_AUTH}" != "401" ]; then
    fail "POST /empresas with no Authorization header returned ${STATUS_NO_AUTH} (expected 401)"
fi
pass "POST /empresas with no token -> 401"

# ---------------------------------------------------------------------------
# Step 5: POST /empresas with a non-admin (monitor) token -> 403
# ---------------------------------------------------------------------------
echo "== Step 5: POST /empresas with monitor token (expect 403) =="

STATUS_MONITOR=$(curl -s -o /dev/null -w '%{http_code}' -X POST "${API_BASE}/empresas" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN_MONITOR}" \
    -d "${VALID_BODY}")

if [ "${STATUS_MONITOR}" != "403" ]; then
    fail "POST /empresas with monitor token returned ${STATUS_MONITOR} (expected 403)"
fi
pass "POST /empresas with monitor token -> 403"

# ---------------------------------------------------------------------------
# Step 6: POST /empresas with admin token + valid body -> 201 (real insert)
# ---------------------------------------------------------------------------
echo "== Step 6: POST /empresas with admin token (expect 201) =="

RESPONSE_ADMIN=$(curl -s -w '\n%{http_code}' -X POST "${API_BASE}/empresas" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN_ADMIN}" \
    -d "${VALID_BODY}")

STATUS_ADMIN=$(printf '%s' "${RESPONSE_ADMIN}" | tail -n1)
BODY_ADMIN=$(printf '%s' "${RESPONSE_ADMIN}" | sed '$d')

if [ "${STATUS_ADMIN}" != "201" ]; then
    fail "POST /empresas with admin token returned ${STATUS_ADMIN} (expected 201): ${BODY_ADMIN}"
fi

NEW_ID=$(printf '%s' "${BODY_ADMIN}" | node -e '
    let data = "";
    process.stdin.on("data", d => data += d);
    process.stdin.on("end", () => {
        try {
            const parsed = JSON.parse(data);
            process.stdout.write(String(parsed.idempresa || ""));
        } catch (e) {
            process.stdout.write("");
        }
    });
')

if [ -z "${NEW_ID}" ]; then
    fail "POST /empresas with admin token returned 201 but no idempresa in body: ${BODY_ADMIN}"
fi

pass "POST /empresas with admin token -> 201, real row idempresa=${NEW_ID}"

# ---------------------------------------------------------------------------
# Step 7: DELETE /empresas/:id admin -> 200 (real delete of the row just inserted)
# ---------------------------------------------------------------------------
echo "== Step 7: DELETE /empresas/${NEW_ID} with admin token (expect 200) =="
STATUS_DEL=$(curl -s -o /dev/null -w '%{http_code}' -X DELETE "${API_BASE}/empresas/${NEW_ID}" \
    -H "Authorization: Bearer ${TOKEN_ADMIN}")
if [ "${STATUS_DEL}" != "200" ]; then
    fail "DELETE /empresas/${NEW_ID} with admin token returned ${STATUS_DEL} (expected 200)"
fi
pass "DELETE /empresas/${NEW_ID} with admin token -> 200"

# ---------------------------------------------------------------------------
# Step 8: PUT /alertas/1/estado with monitor token + estado string -> 200
# ---------------------------------------------------------------------------
echo "== Step 8: PUT /alertas/1/estado with monitor token (expect 200) =="
STATUS_ESTADO=$(curl -s -o /dev/null -w '%{http_code}' -X PUT "${API_BASE}/alertas/1/estado" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN_MONITOR}" \
    -d '{"estado":"En Proceso"}')
if [ "${STATUS_ESTADO}" != "200" ]; then
    fail "PUT /alertas/1/estado with monitor token returned ${STATUS_ESTADO} (expected 200)"
fi
pass "PUT /alertas/1/estado with monitor token -> 200"

# ---------------------------------------------------------------------------
# Step 9: POST /usuarios with TI token -> 201 (real user creation)
# ---------------------------------------------------------------------------
echo "== Step 9: POST /usuarios with TI token (expect 201) =="
UNIQUE_CORREO="verify_$(date +%s)_$(shuf -i 1000-9999 -n 1)@test.com"
RESP_USER=$(curl -s -w '\n%{http_code}' -X POST "${API_BASE}/usuarios" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN_TI}" \
    -d "{\"nombreUsuario\":\"verify\",\"correo\":\"${UNIQUE_CORREO}\",\"contrasenia\":\"test1234\",\"rol\":\"monitor\",\"Empresa_idEmpresa\":1}")
STATUS_USER=$(printf '%s' "${RESP_USER}" | tail -n1)
if [ "${STATUS_USER}" != "201" ]; then
    fail "POST /usuarios with TI token returned ${STATUS_USER} (expected 201)"
fi
pass "POST /usuarios with TI token -> 201"

# ---------------------------------------------------------------------------
# Step 10: GET /system/status with TI token -> 200, no secrets leaked
# ---------------------------------------------------------------------------
echo "== Step 10: GET /system/status with TI token (expect 200 + no secret values) =="
STATUS_SYS=$(curl -s -o /dev/null -w '%{http_code}' "${API_BASE}/system/status" \
    -H "Authorization: Bearer ${TOKEN_TI}")
if [ "${STATUS_SYS}" != "200" ]; then
    fail "GET /system/status with TI token returned ${STATUS_SYS} (expected 200)"
fi
BODY_SYS=$(curl -s "${API_BASE}/system/status" -H "Authorization: Bearer ${TOKEN_TI}")
DB_OK=$(printf '%s' "${BODY_SYS}" | node -e 'let d="";process.stdin.on("data",x=>d+=x);process.stdin.on("end",()=>{try{process.stdout.write(String(JSON.parse(d).db))}catch(e){process.stdout.write("")}}) ')
if [ "${DB_OK}" != "ok" ]; then
    fail "GET /system/status body .db != 'ok': ${BODY_SYS}"
fi
pass "GET /system/status with TI token -> 200, db=ok"

# ---------------------------------------------------------------------------
# Final
# ---------------------------------------------------------------------------
echo ""
echo "WALKING SKELETON VERIFIED"
