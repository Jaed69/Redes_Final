import { claseEstadoAlerta } from "../../types/models";
import type { Alerta, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

interface ClienteAlertasProps {
  alertas: Alerta[];
  vinedos: Vinedo[];
  empresaId: string;
}

export default function ClienteAlertas({ alertas, vinedos, empresaId }: ClienteAlertasProps) {
  const misVinedosIds = new Set(vinedos.filter((v) => v.empresaNombre).map((v) => v.id));
  const misAlertas = alertas.filter((a) => misVinedosIds.has(a.vinedoId ?? ""));

  const vinedoNombrePorId = new Map(vinedos.map((v) => [v.id, v.nombre]));

  return (
    <div className="alerts-view">
      <header className="view-header">
        <h1>Alertas</h1>
        <p className="view-header__sub">Alertas registradas en los viñedos de tu empresa</p>
      </header>

      <div className="panel alerts-list">
        {misAlertas.map((a) => {
          const tono = claseEstadoAlerta(a.estado);
          return (
            <div key={a.id} className={`alert-row alert-row--${tono}`}>
              <span className={`status-dot ${tono}`} />
              <div className="alert-row__body">
                <div className="alert-row__top">
                  <span className="alert-row__origen">
                    {a.tipo === "Sensor" ? "📡" : "🧬"} {vinedoNombrePorId.get(a.vinedoId ?? "") ?? a.tipo}
                  </span>
                </div>
                <p className="alert-row__desc">{a.descripcion}</p>
              </div>
              <span className={`estado-pill ${tono}`}>{a.estado}</span>
            </div>
          );
        })}
        {misAlertas.length === 0 && <p className="empty-hint">No hay alertas registradas.</p>}
      </div>
      {empresaId === "" && <p className="empty-hint">Aviso: no se identificó tu empresa.</p>}
    </div>
  );
}