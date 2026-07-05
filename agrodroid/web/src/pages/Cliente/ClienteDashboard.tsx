import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../../components/StatCard";
import type {
  Alerta,
  DeteccionEnfermedad,
  LecturaSensor,
  Notificacion,
  Sensor,
  Vinedo,
} from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface ClienteDashboardProps {
  vinedos: Vinedo[];
  sensores: Sensor[];
  alertas: Alerta[];
  detecciones: DeteccionEnfermedad[];
  lecturas: LecturaSensor[];
  notificaciones: Notificacion[];
  empresaId: string;
}

export default function ClienteDashboard({
  vinedos,
  sensores,
  alertas,
  detecciones,
  lecturas,
  notificaciones,
  empresaId,
}: ClienteDashboardProps) {
  const misVinedos = useMemo(
    () => vinedos.filter((v) => !empresaId || v.empresaId === empresaId),
    [vinedos, empresaId]
  );
  const misVinedosIds = useMemo(() => new Set(misVinedos.map((v) => v.id)), [misVinedos]);
  const misSensores = useMemo(
    () => sensores.filter((s) => misVinedosIds.has(s.vinedoId ?? "")),
    [sensores, misVinedosIds]
  );
  const misAlertas = useMemo(
    () => alertas.filter((a) => misVinedosIds.has(a.vinedoId ?? "")),
    [alertas, misVinedosIds]
  );
  const misSensoresIds = useMemo(() => new Set(misSensores.map((s) => s.id)), [misSensores]);
  const misLecturas = useMemo(
    () => lecturas.filter((l) => misSensoresIds.has(l.sensorId)),
    [lecturas, misSensoresIds]
  );
  const alertasActivas = misAlertas.filter((a) => a.estado !== "Resuelta");

  // Trend de lecturas: promedio de valor por fecha, todos los sensores de su empresa
  const trendData = useMemo(() => {
    const byFecha = new Map<string, { sum: number; count: number }>();
    misLecturas.forEach((l) => {
      const cur = byFecha.get(l.fecha) ?? { sum: 0, count: 0 };
      cur.sum += l.valor;
      cur.count += 1;
      byFecha.set(l.fecha, cur);
    });
    return Array.from(byFecha.entries())
      .map(([fecha, { sum, count }]) => ({ fecha, valor: +(sum / count).toFixed(2) }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [misLecturas]);

  // BarChart: alertas por viñedo (activas vs resueltas)
  const alertasPorVinedo = useMemo(
    () =>
      misVinedos.map((v) => {
        const delV = misAlertas.filter((a) => a.vinedoId === v.id);
        return {
          viñedo: v.nombre.length > 14 ? v.nombre.slice(0, 12) + "…" : v.nombre,
          activas: delV.filter((a) => a.estado !== "Resuelta").length,
          resueltas: delV.filter((a) => a.estado === "Resuelta").length,
        };
      }),
    [misVinedos, misAlertas]
  );

  const notifsRecientes = notificaciones.slice(0, 6);

  return (
    <div>
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Vista de solo lectura de tus viñedos ({empresaNombre(misVinedos, empresaId)})</p>
      </header>

      <section className="roled-kpis">
        <StatCard label="Viñedos" value={misVinedos.length} tone="vine" icon="🌱" />
        <StatCard label="Sensores" value={misSensores.length} tone="water" icon="📡" />
        <StatCard label="Alertas activas" value={alertasActivas.length} tone="critical" icon="🚨" />
        <StatCard label="Detecciones IA" value={detecciones.length} tone="violet" icon="🧬" />
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Tendencia de lecturas (promedio por fecha)</span>
            <span className="eyebrow">{misLecturas.length} lecturas</span>
          </div>
          <div className="roled-chart">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="fecha" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Valor promedio"
                    stroke="var(--accent-water)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--accent-water)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">No hay lecturas registradas para tus viñedos.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Alertas por viñedo</span>
            <span className="eyebrow">{misAlertas.length} alertas</span>
          </div>
          <div className="roled-chart">
            {alertasPorVinedo.some((d) => d.activas + d.resueltas > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertasPorVinedo} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="viñedo" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <Bar dataKey="activas" name="Activas" fill="var(--critical)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resueltas" name="Resueltas" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Aún no hay alertas registradas para tus viñedos.</p>
            )}
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Mis viñedos</span>
            <span className="eyebrow">{misVinedos.length} viñedos</span>
          </div>
          <table className="roled-table">
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
              {misVinedos.map((v) => (
                <tr key={v.id}>
                  <td>{v.nombre}</td>
                  <td>{v.ubicacion}</td>
                  <td className="mono">{v.areaHectareas.toFixed(2)}</td>
                  <td className="mono">
                    {misSensores.filter((s) => s.vinedoId === v.id).length}
                  </td>
                  <td className="mono">{misAlertas.filter((a) => a.vinedoId === v.id).length}</td>
                </tr>
              ))}
              {misVinedos.length === 0 && (
                <tr>
                  <td colSpan={5} className="roled-empty">
                    No hay viñedos asociados a tu empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Notificaciones recientes</span>
            <span className="eyebrow">{notifsRecientes.length} avisos</span>
          </div>
          {notifsRecientes.length === 0 ? (
            <p className="roled-empty">Sin notificaciones.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px" }}>
              {notifsRecientes.map((n) => (
                <li
                  key={n.id}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 8,
                    background: "var(--surface-raised)",
                  }}
                >
                  <div style={{ fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>
                    {n.mensaje}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {n.fecha} · {n.hora} · {n.usuarioNombre}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {empresaId === "" && (
        <p className="roled-empty">Aviso: no se identificó tu empresa en la sesión.</p>
      )}
    </div>
  );
}

function empresaNombre(misVinedos: Vinedo[], empresaId: string): string {
  if (misVinedos.length === 0) return "—";
  return misVinedos[0].empresaNombre ?? `Empresa ${empresaId}`;
}