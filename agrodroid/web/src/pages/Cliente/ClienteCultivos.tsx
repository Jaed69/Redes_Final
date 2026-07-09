import { useMemo } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import StatCard from "../../components/StatCard";
import DiseaseImagePlaceholder from "../../components/DiseaseImagePlaceholder";
import type { DeteccionEnfermedad, Dron, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface ClienteCultivosProps {
  detecciones: DeteccionEnfermedad[];
  drones: Dron[];
  vinedos: Vinedo[];
  empresaId: string;
}

const COLORS = ["#8fbc8f", "#d3d3d3", "#c4a882", "#888", "#daa520", "#cd5c5c"];

export default function ClienteCultivos({ detecciones, drones, vinedos, empresaId }: ClienteCultivosProps) {
  const misDetecciones = useMemo(() => {
    const vinedoIds = new Set(vinedos.filter((v) => !empresaId || v.empresaId === empresaId).map((v) => v.id));
    const imagenIdsValidas = new Set<string>();
    drones.forEach((dr) => {
      const dronPertenece = vinedoIds.has(dr.vinedoId ?? "");
      if (dronPertenece) dr.imagenes.forEach((im) => imagenIdsValidas.add(im.id));
    });
    return detecciones.filter((d) => imagenIdsValidas.has(d.imagenId));
  }, [detecciones, drones, vinedos, empresaId]);

  const enfermedadPorMes = useMemo(() => {
    const porMes: Record<string, Record<string, number>> = {};
    misDetecciones.forEach((d) => {
      const mes = d.fecha?.slice(0, 7) ?? "?";
      if (!porMes[mes]) porMes[mes] = {};
      porMes[mes][d.enfermedad] = (porMes[mes][d.enfermedad] || 0) + 1;
    });
    return Object.entries(porMes)
      .map(([mes, enf]) => ({ mes, ...enf }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  }, [misDetecciones]);

  const distribucionEnfermedades = useMemo(() => {
    const conteo: Record<string, number> = {};
    misDetecciones.forEach((d) => { conteo[d.enfermedad] = (conteo[d.enfermedad] || 0) + 1; });
    return Object.entries(conteo).map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }));
  }, [misDetecciones]);

  const avgConfianza = misDetecciones.length > 0
    ? misDetecciones.reduce((s, d) => s + d.nivelConfianza, 0) / misDetecciones.length
    : 0;

  const enfermedadesUnicas = new Set(misDetecciones.map((d) => d.enfermedad)).size;
  const saludPct = misDetecciones.length === 0 ? 100 : Math.max(0, 100 - Math.min(100, misDetecciones.length * 5));

  const imagenDeDeteccion = useMemo(() => {
    const m = new Map<string, { dron: string; fecha: string }>();
    drones.forEach((dr) => dr.imagenes.forEach((im) => m.set(im.id, { dron: dr.nombre, fecha: im.fecha })));
    return (d: DeteccionEnfermedad) => m.get(d.imagenId);
  }, [drones]);

  return (
    <div>
      <header className="view-header">
        <h1>Salud de cultivos</h1>
        <p className="view-header__sub">Detecciones de plagas por análisis de imágenes de drones sobre tus viñedos</p>
      </header>

      <section className="roled-kpis">
        <StatCard label="Detecciones" value={misDetecciones.length} tone="critical" icon="🧬" />
        <StatCard label="Enfermedades únicas" value={enfermedadesUnicas} tone="violet" icon="🍃" />
        <StatCard label="Confianza promedio" value={`${avgConfianza.toFixed(1)}%`} tone="water" icon="📈" />
        <StatCard label="Salud general" value={`${saludPct}%`} tone={saludPct > 70 ? "vine" : "critical"} icon="🌱" />
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Distribución de enfermedades</span>
            <span className="eyebrow">{misDetecciones.length} detecciones</span>
          </div>
          <div className="roled-chart">
            {distribucionEnfermedades.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribucionEnfermedades} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {distribucionEnfermedades.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin detecciones para mostrar.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Detecciones por mes</span>
          </div>
          <div className="roled-chart">
            {enfermedadPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enfermedadPorMes} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="mes" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} width={28} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {Object.keys(enfermedadPorMes[0] || {}).filter((k) => k !== "mes").map((enf, i) => (
                    <Line key={enf} type="monotone" dataKey={enf} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin datos temporales.</p>
            )}
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel admin-dashboard__panel--full" style={{ gridColumn: "1 / -1" }}>
          <div className="roled-panel__title">
            <span>Detecciones recientes</span>
            <span className="eyebrow">{misDetecciones.length} total</span>
          </div>
          {misDetecciones.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {misDetecciones.slice(0, 12).map((d) => {
                const img = imagenDeDeteccion(d);
                return (
                  <div key={d.id} style={{ border: "1px solid var(--border-soft)", borderRadius: 12, overflow: "hidden", background: "var(--surface)" }}>
                    <div style={{ height: 140 }}>
                      <DiseaseImagePlaceholder enfermedad={d.enfermedad} confianza={d.nivelConfianza} />
                    </div>
                    <div style={{ padding: "10px 14px", display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{d.enfermedad}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Confianza: {d.nivelConfianza.toFixed(1)}% · {d.fecha}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {img ? `${img.dron} · ${img.fecha}` : "Sin imagen asociada"}
                      </div>
                      {d.descripcion && (
                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{d.descripcion}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="roled-empty">No hay detecciones registradas para tus viñedos.</p>
          )}
        </div>
      </section>
    </div>
  );
}