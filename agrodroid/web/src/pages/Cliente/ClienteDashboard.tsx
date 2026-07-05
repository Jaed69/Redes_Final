import StatCard from "../../components/StatCard";
import type { Alerta, DeteccionEnfermedad, Sensor, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

interface ClienteDashboardProps {
  vinedos: Vinedo[];
  sensores: Sensor[];
  alertas: Alerta[];
  detecciones: DeteccionEnfermedad[];
  empresaId: string;
}

export default function ClienteDashboard({
  vinedos,
  sensores,
  alertas,
  detecciones,
  empresaId,
}: ClienteDashboardProps) {
  const misVinedos = vinedos;
  const misSensores = sensores.filter((s) =>
    misVinedos.some((v) => v.id === s.vinedoId)
  );
  const misAlertas = alertas.filter((a) =>
    misVinedos.some((v) => v.id === a.vinedoId)
  );
  const alertasActivas = misAlertas.filter((a) => a.estado !== "Resuelta");

  const metrics = misVinedos.map((v) => ({
    nombre: v.nombre,
    alertas: misAlertas.filter((a) => a.vinedoId === v.id).length,
    sensores: misSensores.filter((s) => s.vinedoId === v.id).length,
  }));

  return (
    <div className="dashboard-view">
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Vista de solo lectura de tus viñedos</p>
      </header>

      <section className="dashboard-view__kpis">
        <StatCard label="Viñedos" value={misVinedos.length} tone="vine" icon="🌱" />
        <StatCard label="Sensores" value={misSensores.length} tone="water" icon="📡" />
        <StatCard label="Alertas activas" value={alertasActivas.length} tone="critical" icon="🚨" />
        <StatCard label="Detecciones IA" value={detecciones.length} tone="violet" icon="🧬" />
      </section>

      <section className="panel dashboard-view__vinedos">
        <div className="panel-header">
          <span className="panel-title">Mis viñedos</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Viñedo</th>
                <th>Ubicación</th>
                <th>Área (ha)</th>
                <th>Sensores</th>
                <th>Alertas</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.nombre}>
                  <td>{m.nombre}</td>
                  <td>{misVinedos.find((v) => v.nombre === m.nombre)?.ubicacion ?? "—"}</td>
                  <td className="mono-cell">
                    {misVinedos.find((v) => v.nombre === m.nombre)?.areaHectareas.toFixed(2)}
                  </td>
                  <td className="mono-cell">{m.sensores}</td>
                  <td className="mono-cell">{m.alertas}</td>
                </tr>
              ))}
              {metrics.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-hint">
                    No hay viñedos asociados a tu empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel dashboard-view__resumen">
        <div className="panel-header">
          <span className="panel-title">Resumen de alertas</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {misAlertas.map((a) => (
                <tr key={a.id}>
                  <td className="data-table__desc">{a.descripcion}</td>
                  <td>{a.tipo}</td>
                  <td>{a.estado}</td>
                </tr>
              ))}
              {misAlertas.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty-hint">
                    Sin alertas para tu empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {empresaId === "" && (
        <p className="empty-hint">Aviso: no se identificó tu empresa en la sesión.</p>
      )}
    </div>
  );
}