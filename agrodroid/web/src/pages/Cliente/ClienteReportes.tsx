import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Alerta, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface ClienteReportesProps {
  vinedos: Vinedo[];
  alertas: Alerta[];
  empresaId: string;
}

const COLORS = {
  pendiente: "#dc2626",
  enProceso: "#d97706",
  resuelta: "#2e7d32",
};

export default function ClienteReportes({ vinedos, alertas, empresaId }: ClienteReportesProps) {
  const misVinedos = useMemo(
    () => vinedos.filter((v) => !empresaId || v.empresaId === empresaId),
    [vinedos, empresaId]
  );

  const filas = useMemo(
    () =>
      misVinedos
        .map((v) => {
          const delVinedo = alertas.filter((a) => a.vinedoId === v.id);
          return {
            vinedo: v.nombre,
            alertas: delVinedo.length,
            activas: delVinedo.filter((a) => a.estado !== "Resuelta").length,
            resueltas: delVinedo.filter((a) => a.estado === "Resuelta").length,
            score: delVinedo.length,
          };
        })
        .sort((a, b) => b.score - a.score),
    [misVinedos, alertas]
  );

  const misAlertas = useMemo(
    () => alertas.filter((a) => misVinedos.some((v) => v.id === a.vinedoId)),
    [alertas, misVinedos]
  );

  const distribucion = useMemo(() => {
    const counts = { Pendiente: 0, "En Proceso": 0, Resuelta: 0 } as Record<string, number>;
    misAlertas.forEach((a) => {
      if (counts[a.estado] !== undefined) counts[a.estado] += 1;
    });
    return [
      { name: "Pendiente", value: counts["Pendiente"], fill: COLORS.pendiente },
      { name: "En Proceso", value: counts["En Proceso"], fill: COLORS.enProceso },
      { name: "Resuelta", value: counts["Resuelta"], fill: COLORS.resuelta },
    ];
  }, [misAlertas]);

  return (
    <div>
      <header className="view-header">
        <h1>Reportes comparativos</h1>
        <p className="view-header__sub">Comparativa de viñedos de tu empresa por alertas y distribución de estados</p>
      </header>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Alertas activas vs. resueltas por viñedo</span>
          </div>
          <div className="roled-chart">
            {filas.some((f) => f.activas + f.resueltas > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filas} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis
                    dataKey="vinedo"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 11) + "…" : v)}
                  />
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
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="activas" name="Activas" fill="var(--critical)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resueltas" name="Resueltas" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">No hay alertas para tus viñedos.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Distribución de estados</span>
          </div>
          <div className="roled-chart">
            {misAlertas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucion}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {distribucion.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin alertas para graficar.</p>
            )}
          </div>
        </div>
      </section>

      <div className="roled-panel">
        <div className="roled-panel__title">
          <span>Ranking de viñedos por alertas</span>
        </div>
        <table className="roled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Viñedo</th>
              <th>Alertas totales</th>
              <th>Activas</th>
              <th>Resueltas</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.vinedo}>
                <td className="mono">{i + 1}</td>
                <td>{f.vinedo}</td>
                <td className="mono">{f.alertas}</td>
                <td className="mono">{f.activas}</td>
                <td className="mono">{f.resueltas}</td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={5} className="roled-empty">
                  No hay viñedos asociados a tu empresa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {empresaId === "" && <p className="roled-empty">Aviso: no se identificó tu empresa.</p>}
    </div>
  );
}