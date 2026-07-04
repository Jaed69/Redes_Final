import StatCard from "../../components/StatCard";
import DataReadout from "../../components/DataReadOut";
import type { Alerta, DeteccionEnfermedad, Sensor, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

export interface DashboardViewProps {
  vinedos: Vinedo[];
  vinedoActivoId: string | null;
  onSeleccionarVinedo: (vinedoId: string) => void;
  sensores: Sensor[];
  alertas: Alerta[];
  detecciones: DeteccionEnfermedad[];
}

/** Vista 1 — visión global: KPIs, viñedos de la empresa y resumen de alertas. */
export default function DashboardView({
  vinedos,
  vinedoActivoId,
  onSeleccionarVinedo,
  sensores,
  alertas,
  detecciones,
}: DashboardViewProps) {
  const alertasActivas = alertas.filter((a) => a.estado !== "resuelto").length;
  const sensoresCriticos = sensores.filter((s) => s.estado === "critico").length;
  const deteccionesRecientes = detecciones.slice(0, 5);
  const resumen = alertas.slice(0, 6);

  return (
    <div className="dashboard-view">
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Visión global del estado de tus viñedos</p>
      </header>

      <section className="dashboard-view__kpis">
        <StatCard label="Alertas activas" value={alertasActivas} tone="critical" icon="🚨" />
        <StatCard label="Sensores críticos" value={sensoresCriticos} tone="water" icon="📡" />
        <StatCard label="Detecciones recientes" value={detecciones.length} tone="violet" icon="🧬" />
        <StatCard label="Viñedos monitoreados" value={vinedos.length} tone="vine" icon="🌱" />
      </section>

      <section className="dashboard-view__grid">
        <div className="panel dashboard-view__vinedos">
          <div className="panel-header">
            <span className="panel-title">Tus viñedos</span>
          </div>
          <div className="vinedo-list">
            {vinedos.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`vinedo-card ${v.id === vinedoActivoId ? "is-active" : ""}`}
                onClick={() => onSeleccionarVinedo(v.id)}
              >
                <div className="vinedo-card__top">
                  <span className="vinedo-card__nombre">{v.nombre}</span>
                  {v.id === vinedoActivoId && <span className="vinedo-card__tag">Activo</span>}
                </div>
                <span className="vinedo-card__ubicacion">{v.ubicacion}</span>
                <DataReadout label="Área" value={v.areaHectareas} unit="ha" tone="vine" />
              </button>
            ))}
            {vinedos.length === 0 && <p className="empty-hint">Aún no hay viñedos asociados a tu empresa.</p>}
          </div>
        </div>

        <div className="panel dashboard-view__resumen">
          <div className="panel-header">
            <span className="panel-title">Resumen de alertas</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((a) => (
                  <tr key={a.id}>
                    <td>{a.origenNombre}</td>
                    <td className="data-table__desc">{a.descripcion}</td>
                    <td className="mono-cell">
                      {a.fecha} · {a.hora}
                    </td>
                    <td>
                      <span className={`estado-pill ${a.estado}`}>
                        <span className={`status-dot ${a.estado}`} />
                        {a.estado.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
                {resumen.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-hint">
                      Sin alertas registradas por ahora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {deteccionesRecientes.length > 0 && (
        <section className="panel dashboard-view__detecciones">
          <div className="panel-header">
            <span className="panel-title">Últimas detecciones IA</span>
          </div>
          <div className="mini-detecciones">
            {deteccionesRecientes.map((d) => (
              <div key={d.id} className="mini-deteccion">
                <span className="mini-deteccion__nombre">{d.enfermedad}</span>
                <DataReadout label="Confianza" value={d.nivelConfianza.toFixed(1)} unit="%" tone="violet" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}