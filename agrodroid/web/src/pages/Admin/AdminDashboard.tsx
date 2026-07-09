import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../../components/StatCard";
import { api } from "../../services/api";
import "../../styles/Admin/AdminDashboard.css";
import "../../styles/Shared/ClienteTi.css";

type Counts = {
  empresas: number;
  vinedos: number;
  usuarios: number;
  sensores: number;
  drones: number;
  alertas: number;
};

type AlertaResumen = {
  id: string;
  descripcion: string;
  estado: string;
  tipo: string;
  vinedoNombre?: string;
};

type UsuarioResumen = {
  id: string;
  nombre: string;
  correo: string;
  empresaNombre: string;
  rol: string;
};

const EMPTY: Counts = {
  empresas: 0,
  vinedos: 0,
  usuarios: 0,
  sensores: 0,
  drones: 0,
  alertas: 0,
};

const COLORS = ["var(--accent-mint-deep)", "var(--warning)", "var(--critical)", "var(--accent-violet)"];
const COLORS_D = ["#8fbc8f", "#d3d3d3", "#c4a882", "#888", "#daa520", "#cd5c5c"];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [alertas, setAlertas] = useState<AlertaResumen[]>([]);
  const [alertasFull, setAlertasFull] = useState<AlertaResumen[]>([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState<UsuarioResumen[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
  const [detecciones, setDetecciones] = useState<{ id: string; enfermedad: string; vinedoNombre: string; confianza: number; fecha: string; dronNombre: string }[]>([]);
  const [dronesResumen, setDronesResumen] = useState<{ id: string; nombre: string; vinedoNombre: string; nImagenes: number; nDetecciones: number; ultimaCaptura: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [empresas, vinedos, usuariosApi, sensores, dronesApi, alertasApi, deteccionesApi, imagenesApi] = await Promise.all([
          api.get("/empresas") as Promise<unknown[]>,
          api.get("/vinedos") as Promise<{ idvinedo: number; nombrevinedo: string; empresa_idempresa: number }[]>,
          api.get("/usuarios") as Promise<{ idusuario: number; nombreusuario: string; correo: string; rol: string; nombreempresa: string }[]>,
          api.get("/sensores") as Promise<unknown[]>,
          api.get("/drones") as Promise<{ iddron: number; nombredron: string; vinedo_idvinedo: number; nombrevinedo: string }[]>,
          api.get("/alertas") as Promise<{ idalerta: number; descripcion: string; estado: string; tipo: string; vinedo_idvinedo: number; nombreempresa: string }[]>,
          api.get("/detecciones") as Promise<{ iddeteccion: number; nombreenfermedad: string; nivelconfianza: string; fechadeteccion: string; imagen_idimagen: number; descripcion: string }[]>,
          api.get("/imagenes") as Promise<{ idimagen: number; dron_iddron: number; fechacaptura: string; tamanoarchivo: number }[]>,
        ]);

        const vinedoNombrePorId = new Map(vinedos.map((v) => [String(v.idvinedo), v.nombrevinedo]));

        setCounts({
          empresas: empresas.length,
          vinedos: vinedos.length,
          usuarios: usuariosApi.length,
          sensores: sensores.length,
          drones: dronesApi.length,
          alertas: alertasApi.length,
        });

        const usuariosMap = usuariosApi.map((u) => ({
          id: String(u.idusuario),
          nombre: u.nombreusuario,
          correo: u.correo,
          empresaNombre: u.nombreempresa,
          rol: u.rol,
        }));
        setUsuarios(usuariosMap);
        setUsuariosRecientes([...usuariosMap].slice(-5).reverse());

        const mapAlerta = (a: { idalerta: number; descripcion: string; estado: string; tipo: string; vinedo_idvinedo: number; nombreempresa: string }): AlertaResumen => ({
          id: String(a.idalerta),
          descripcion: a.descripcion,
          estado: a.estado,
          tipo: a.tipo,
          vinedoNombre: vinedoNombrePorId.get(String(a.vinedo_idvinedo)) ?? a.nombreempresa,
        });

        setAlertas([...alertasApi].slice(-5).reverse().map(mapAlerta));
        setAlertasFull(alertasApi.map(mapAlerta));

        // Detecciones + resumen drones
        const imagenPorId = new Map(imagenesApi.map((im) => [String(im.idimagen), { dronId: String(im.dron_iddron), fecha: im.fechacaptura?.slice(0, 10) ?? "—" }]));
        const dronNombrePorId = new Map(dronesApi.map((d) => [String(d.iddron), d.nombredron]));
        const vinedoNombreDron = new Map(dronesApi.map((d) => [String(d.iddron), d.nombrevinedo]));

        setDetecciones(deteccionesApi.map((det) => {
          const img = imagenPorId.get(String(det.imagen_idimagen));
          return {
            id: String(det.iddeteccion),
            enfermedad: det.nombreenfermedad ?? "Desconocida",
            vinedoNombre: img ? (vinedoNombreDron.get(img.dronId) ?? "—") : "—",
            confianza: parseFloat(det.nivelconfianza),
            fecha: det.fechadeteccion?.slice(0, 10) ?? "—",
            dronNombre: img ? (dronNombrePorId.get(img.dronId) ?? "—") : "—",
          };
        }));

        const deteccionesPorImagen = new Map<string, number>();
        deteccionesApi.forEach((det) => {
          const k = String(det.imagen_idimagen);
          deteccionesPorImagen.set(k, (deteccionesPorImagen.get(k) ?? 0) + 1);
        });
        setDronesResumen(dronesApi.map((dr) => {
          const imgs = imagenesApi.filter((im) => String(im.dron_iddron) === String(dr.iddron));
          const nDet = imgs.reduce((s, im) => s + (deteccionesPorImagen.get(String(im.idimagen)) ?? 0), 0);
          return {
            id: String(dr.iddron),
            nombre: dr.nombredron,
            vinedoNombre: dr.nombrevinedo,
            nImagenes: imgs.length,
            nDetecciones: nDet,
            ultimaCaptura: imgs.length > 0 ? imgs[imgs.length - 1].fechacaptura?.slice(0, 10) ?? "—" : "—",
          };
        }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const dataUsuariosPorRol = ["admin", "monitor", "cliente", "ti"].map((rol, i) => ({
    rol,
    cantidad: usuarios.filter((u) => u.rol === rol).length,
    fill: COLORS[i],
  }));

  const vinedosUnicos = Array.from(new Set(alertasFull.map((a) => a.vinedoNombre ?? "?")));
  const dataAlertasPorVinedo = vinedosUnicos.map((v) => {
    const delV = alertasFull.filter((a) => a.vinedoNombre === v);
    return {
      vinedo: v && v.length > 14 ? v.slice(0, 12) + "…" : v,
      Pendiente: delV.filter((a) => a.estado === "Pendiente").length,
      "En Proceso": delV.filter((a) => a.estado === "En Proceso").length,
      Resuelta: delV.filter((a) => a.estado === "Resuelta").length,
    };
  });

  const estadosUnicos = Array.from(new Set(alertasFull.map((a) => a.estado)));
  const dataAlertasPorEstado = estadosUnicos.map((e) => ({
    name: e,
    value: alertasFull.filter((a) => a.estado === e).length,
  }));

  const deteccionesPorEnf = useMemo(
    () => {
      const conteo: Record<string, number> = {};
      detecciones.forEach((d) => { conteo[d.enfermedad] = (conteo[d.enfermedad] || 0) + 1; });
      return Object.entries(conteo).map(([name, value]) => ({ name, value }));
    },
    [detecciones]
  );

  const deteccionesPorVinedo = useMemo(
    () => {
      const conteo: Record<string, number> = {};
      detecciones.forEach((d) => { conteo[d.vinedoNombre] = (conteo[d.vinedoNombre] || 0) + 1; });
      return Object.entries(conteo).map(([vinedo, detecciones]) => ({
        vinedo: vinedo && vinedo.length > 14 ? vinedo.slice(0, 12) + "…" : vinedo,
        detecciones,
      }));
    },
    [detecciones]
  );

  return (
    <div className="admin-dashboard">
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Resumen general de la plataforma — KPIs, distribución y rendimiento por área</p>
      </header>

      <section className="admin-dashboard__kpis">
        <StatCard label="Empresas" value={counts.empresas} tone="vine" icon="🏢" />
        <StatCard label="Viñedos" value={counts.vinedos} tone="vine" icon="🌱" />
        <StatCard label="Usuarios" value={counts.usuarios} tone="water" icon="👤" />
        <StatCard label="Sensores" value={counts.sensores} tone="water" icon="📡" />
        <StatCard label="Drones" value={counts.drones} tone="copper" icon="🚁" />
        <StatCard label="Alertas" value={counts.alertas} tone="critical" icon="🚨" />
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Alertas por viñedo (apilado por estado)</span>
            <span className="eyebrow">{counts.alertas} alertas · {vinedosUnicos.length} viñedos</span>
          </div>
          <div className="roled-chart">
            {dataAlertasPorVinedo.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataAlertasPorVinedo} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="vinedo" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Pendiente" stackId="a" fill="var(--critical)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="En Proceso" stackId="a" fill="var(--warning)" />
                  <Bar dataKey="Resuelta" stackId="a" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">No hay alertas registradas.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Distribución de alertas por estado</span>
          </div>
          <div className="roled-chart">
            {dataAlertasPorEstado.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataAlertasPorEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {dataAlertasPorEstado.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin datos.</p>
            )}
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Usuarios por rol</span>
            <span className="eyebrow">{counts.usuarios} usuarios</span>
          </div>
          <div className="roled-chart">
            {dataUsuariosPorRol.some((d) => d.cantidad > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataUsuariosPorRol} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="rol" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin usuarios.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Últimos usuarios</span>
          </div>
          <div className="table-wrap">
            <table className="roled-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Empresa</th>
                </tr>
              </thead>
              <tbody>
                {usuariosRecientes.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td className="mono">{u.correo}</td>
                    <td>{u.empresaNombre}</td>
                  </tr>
                ))}
                {usuariosRecientes.length === 0 && (
                  <tr><td colSpan={3} className="roled-empty">No hay usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Últimas alertas</span>
          </div>
          <div className="table-wrap">
            <table className="roled-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Viñedo</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((a) => (
                  <tr key={a.id}>
                    <td>{a.descripcion}</td>
                    <td>{a.vinedoNombre}</td>
                    <td>{a.tipo}</td>
                    <td>{a.estado}</td>
                  </tr>
                ))}
                {alertas.length === 0 && (
                  <tr><td colSpan={4} className="roled-empty">No hay alertas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Distribución de enfermedades</span>
            <span className="eyebrow">{detecciones.length} detecciones</span>
          </div>
          <div className="roled-chart">
            {deteccionesPorEnf.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deteccionesPorEnf} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {deteccionesPorEnf.map((_, i) => (
                      <Cell key={i} fill={COLORS_D[i % COLORS_D.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin detecciones.</p>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Detecciones por viñedo</span>
          </div>
          <div className="roled-chart">
            {deteccionesPorVinedo.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deteccionesPorVinedo} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="vinedo" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="detecciones" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Sin datos.</p>
            )}
          </div>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel admin-dashboard__panel--full" style={{ gridColumn: "1 / -1" }}>
          <div className="roled-panel__title">
            <span>Resumen de drones (pipeline de captura)</span>
            <span className="eyebrow">{dronesResumen.length} drones</span>
          </div>
          <table className="roled-table">
            <thead>
              <tr>
                <th>Drone</th>
                <th>Viñedo</th>
                <th>Imágenes</th>
                <th>Detecciones</th>
                <th>Última captura</th>
              </tr>
            </thead>
            <tbody>
              {dronesResumen.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.vinedoNombre}</td>
                  <td className="mono">{d.nImagenes}</td>
                  <td className="mono">{d.nDetecciones}</td>
                  <td className="mono">{d.ultimaCaptura}</td>
                </tr>
              ))}
              {dronesResumen.length === 0 && (
                <tr><td colSpan={5} className="roled-empty">Sin drones.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}