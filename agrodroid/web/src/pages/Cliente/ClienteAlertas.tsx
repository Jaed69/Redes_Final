import { useMemo, useState } from "react";
import { claseEstadoAlerta } from "../../types/models";
import type { Alerta, Notificacion, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface ClienteAlertasProps {
  alertas: Alerta[];
  vinedos: Vinedo[];
  notificaciones: Notificacion[];
  empresaId: string;
}

type Tab = "alertas" | "notificaciones";

export default function ClienteAlertas({
  alertas,
  vinedos,
  notificaciones,
  empresaId,
}: ClienteAlertasProps) {
  const [tab, setTab] = useState<Tab>("alertas");

  const misVinedos = useMemo(
    () => vinedos.filter((v) => !empresaId || v.empresaId === empresaId),
    [vinedos, empresaId]
  );
  const misVinedosIds = useMemo(() => new Set(misVinedos.map((v) => v.id)), [misVinedos]);
  const vinedoNombrePorId = useMemo(
    () => new Map(vinedos.map((v) => [v.id, v.nombre])),
    [vinedos]
  );

  const misAlertas = useMemo(
    () => alertas.filter((a) => misVinedosIds.has(a.vinedoId ?? "")),
    [alertas, misVinedosIds]
  );

  // Notificaciones: vienen asociadas a un usuario — el cliente no tiene forma directa
  // de filtrar por viñedo (Notificacion no lleva vinedoId). Para MVP enseñamos todas
  // y relevamos el aviso al usuario — backlog v2: notif por empresa.
  const misNotifs = notificaciones;

  return (
    <div>
      <header className="view-header">
        <h1>Alertas y notificaciones</h1>
        <p className="view-header__sub">Avisos generados para los viñedos de tu empresa (solo lectura)</p>
      </header>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setTab("alertas")}
          className={`roled-pill ${tab === "alertas" ? "roled-pill--ok" : "roled-pill--muted"}`}
          style={{ cursor: "pointer", border: "none" }}
        >
          Alertas ({misAlertas.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("notificaciones")}
          className={`roled-pill ${tab === "notificaciones" ? "roled-pill--ok" : "roled-pill--muted"}`}
          style={{ cursor: "pointer", border: "none" }}
        >
          Notificaciones ({misNotifs.length})
        </button>
      </div>

      {tab === "alertas" ? (
        <div className="roled-panel">
          {misAlertas.length === 0 ? (
            <p className="roled-empty">No hay alertas para tus viñedos.</p>
          ) : (
            misAlertas.map((a) => {
              const tono = claseEstadoAlerta(a.estado);
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--hairline-soft)",
                  }}
                >
                  <span className={`status-dot ${tono}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                      {a.tipo === "Sensor" ? "📡" : "🧬"} {vinedoNombrePorId.get(a.vinedoId ?? "") ?? a.tipo}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text-primary)" }}>{a.descripcion}</div>
                  </div>
                  <span className={`roled-pill ${tonoPill(tono)}`}>{a.estado}</span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="roled-panel">
          {misNotifs.length === 0 ? (
            <p className="roled-empty">No tienes notificaciones.</p>
          ) : (
            misNotifs.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid var(--hairline-soft)",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span className={`status-dot ${n.leida ? "offline" : "critico"}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                    {n.mensaje}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {n.fecha} · {n.hora} · {n.usuarioNombre} · alerta: {n.alertaDescripcion}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {empresaId === "" && <p className="roled-empty">Aviso: no se identificó tu empresa.</p>}
    </div>
  );
}

function tonoPill(tono: string) {
  if (tono === "critico") return "roled-pill--bad";
  if (tono === "resuelto") return "roled-pill--ok";
  return "roled-pill--warn";
}