import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../../components/StatCard";
import { api } from "../../services/api";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

type EstadoSistema = {
  db: string;
  env: Record<string, string>;
  timestamp: string;
};

type ApiUsuario = {
  idusuario: number;
  nombreusuario: string;
  correo: string;
  rol: string;
  nombreempresa: string;
};

type ApiEmpresa = { idempresa: number; nombreempresa: string };

type ApiVinedo = { idvinedo: number; nombrevinedo: string; empresa_idempresa: number; nombreempresa: string };

const COLORS = ["var(--accent-mint-deep)", "var(--accent-water)", "var(--warning)", "var(--critical)", "var(--accent-violet)"];

export default function TiDashboard() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [ultimosUsuarios, setUltimosUsuarios] = useState<ApiUsuario[]>([]);
  const [estado, setEstado] = useState<EstadoSistema | null>(null);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [empresas, setEmpresas] = useState<ApiEmpresa[]>([]);
  const [vinedos, setVinedos] = useState<ApiVinedo[]>([]);
  const [sensores, setSensores] = useState<{ idsensor: number; vinedo_idvinedo: number }[]>([]);
  const [drones, setDrones] = useState<{ iddron: number; vinedo_idvinedo: number }[]>([]);
  const [apiUp, setApiUp] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usuariosApi, empresasApi, estadoSistema, vinedosApi, sensoresApi, dronesApi] = await Promise.all([
          api.get("/usuarios") as Promise<ApiUsuario[]>,
          api.get("/empresas") as Promise<ApiEmpresa[]>,
          api.get("/system/status") as Promise<EstadoSistema>,
          api.get("/vinedos") as Promise<ApiVinedo[]>,
          api.get("/sensores") as Promise<{ idsensor: number; vinedo_idvinedo: number }[]>,
          api.get("/drones") as Promise<{ iddron: number; vinedo_idvinedo: number }[]>,
        ]);
        setApiUp(true);
        setTotalUsuarios(usuariosApi.length);
        setTotalEmpresas(empresasApi.length);
        setUsuarios(usuariosApi);
        setEmpresas(empresasApi);
        setUltimosUsuarios([...usuariosApi].slice(-5).reverse());
        setVinedos(vinedosApi);
        setSensores(sensoresApi);
        setDrones(dronesApi);
        setEstado(estadoSistema);
      } catch (e) {
        setApiUp(false);
        console.error(e);
        if (e instanceof Error) setErrorEstado(e.message);
      }
    })();
  }, []);

  const envFaltantes = estado
    ? Object.entries(estado.env).filter(([, v]) => v !== "set")
    : [];
  const envOk = estado ? envFaltantes.length === 0 : false;
  const envTotal = estado ? Object.keys(estado.env).length : 6;
  const envSetCount = estado ? envTotal - envFaltantes.length : 0;

  // Distribución usuarios por rol
  const roles = ["admin", "monitor", "cliente", "ti"];
  const dataUsuariosPorRol = roles.map((rol, i) => ({
    rol,
    cantidad: usuarios.filter((u) => u.rol === rol).length,
    fill: COLORS[i],
  }));

  // Distribución usuarios por empresa
  const dataUsuariosPorEmpresa = empresas.map((emp, i) => ({
    name: emp.nombreempresa,
    value: usuarios.filter((u) => u.nombreempresa === emp.nombreempresa).length,
    fill: COLORS[i % COLORS.length],
  }));

  // Donut de env flags
  const dataEnvCompleteness = [
    { name: "Configuradas", value: envSetCount, fill: "var(--success)" },
    { name: "Faltantes", value: envTotal - envSetCount, fill: "var(--critical)" },
  ];

  // Resumen por empresa (zona): vinedos/sensores/drones
  const vinedoIdPorEmpresa = new Map<number, number[]>();
  vinedos.forEach((v) => {
    const arr = vinedoIdPorEmpresa.get(v.empresa_idempresa) ?? [];
    arr.push(v.idvinedo);
    vinedoIdPorEmpresa.set(v.empresa_idempresa, arr);
  });
  const dataZonas = empresas.map((emp) => {
    const ids = vinedoIdPorEmpresa.get(emp.idempresa) ?? [];
    const idSet = new Set(ids.map(String));
    return {
      empresa: emp.nombreempresa,
      viñedos: ids.length,
      sensores: sensores.filter((s) => idSet.has(String(s.vinedo_idvinedo))).length,
      drones: drones.filter((d) => idSet.has(String(d.vinedo_idvinedo))).length,
      usuarios: usuarios.filter((u) => u.nombreempresa === emp.nombreempresa).length,
    };
  });

  // Healthchecks de servicios (DB / API / WEB)
  const servicios = [
    { nombre: "API", estado: apiUp ? "ok" : "down", icon: "🛰", detalle: apiUp ? "Respondiendo en :3000" : "Sin respuesta" },
    { nombre: "Base de datos", estado: estado?.db === "ok" ? "ok" : estado?.db === "error" ? "down" : "?", icon: "🗄", detalle: estado?.db === "ok" ? "Conectada" : estado?.db === "error" ? "Sin conexión" : "Verificando…" },
    { nombre: "Web", estado: "ok", icon: "🖥", detalle: "Frontend cargado" },
  ];

  return (
    <div>
      <header className="view-header">
        <h1>Dashboard TI</h1>
        <p className="view-header__sub">Monitoreo de servicios, salud del sistema y control de zonas (empresas)</p>
      </header>

      <section className="roled-kpis">
        <StatCard label="Usuarios" value={totalUsuarios} tone="water" icon="👤" />
        <StatCard label="Empresas (zonas)" value={totalEmpresas} tone="vine" icon="🏢" />
        <StatCard
          label="Base de datos"
          value={estado?.db === "ok" ? "OK" : estado?.db === "error" ? "Fail" : "…"}
          tone={estado?.db === "ok" ? "vine" : "critical"}
          icon="🗄"
        />
        <StatCard
          label="Variables de entorno"
          value={estado ? `${envSetCount}/${envTotal}` : "…"}
          tone={envOk ? "vine" : "critical"}
          icon="⚙"
        />
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Salud de servicios</span>
            <span className="eyebrow">{servicios.filter((s) => s.estado === "ok").length}/{servicios.length} operativos</span>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 4 }}>
            {servicios.map((s) => (
              <div
                key={s.nombre}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--border-soft)", borderRadius: 10, background: "var(--surface-raised)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{s.nombre}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.detalle}</div>
                  </div>
                </div>
                <span
                  className={`roled-pill ${s.estado === "ok" ? "roled-pill--ok" : s.estado === "down" ? "roled-pill--bad" : "roled-pill--warn"}`}
                >
                  {s.estado === "ok" ? "Operativo" : s.estado === "down" ? "Caído" : "Verificando"}
                </span>
              </div>
            ))}
            {estado?.timestamp && (
              <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                Última verificación: {estado.timestamp}
              </div>
            )}
          </div>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Variables de entorno</span>
            <Link to="/ti/sistema" style={{ fontSize: 12, color: "var(--accent-mint-deep)", textDecoration: "none", fontWeight: 500 }}>Ver detalle →</Link>
          </div>
          <div className="roled-chart" style={{ height: 200 }}>
            {estado ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="35%" outerRadius="100%" data={dataEnvCompleteness} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, envTotal]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={8} />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <p className="roled-empty">Cargando…</p>
            )}
          </div>
          {errorEstado && <p className="roled-empty">{errorEstado}</p>}
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Usuarios por rol</span>
            <span className="eyebrow">{totalUsuarios} usuarios</span>
          </div>
          <div className="roled-chart">
            {dataUsuariosPorRol.some((d) => d.cantidad > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataUsuariosPorRol} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="rol" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis allowDecimals stroke="var(--text-muted)" fontSize={11} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
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
            <span>Usuarios por empresa</span>
          </div>
          <div className="roled-chart">
            {dataUsuariosPorEmpresa.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataUsuariosPorEmpresa} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {dataUsuariosPorEmpresa.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
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
        <div className="roled-panel admin-dashboard__panel--full" style={{ gridColumn: "1 / -1" }}>
          <div className="roled-panel__title">
            <span>Control de zonas (recursos por empresa)</span>
            <span className="eyebrow">{totalEmpresas} empresas</span>
          </div>
          <table className="roled-table">
            <thead>
              <tr>
                <th>Empresa (zona)</th>
                <th>Viñedos</th>
                <th>Sensores</th>
                <th>Drones</th>
                <th>Usuarios</th>
              </tr>
            </thead>
            <tbody>
              {dataZonas.map((z) => (
                <tr key={z.empresa}>
                  <td>{z.empresa}</td>
                  <td className="mono">{z.viñedos}</td>
                  <td className="mono">{z.sensores}</td>
                  <td className="mono">{z.drones}</td>
                  <td className="mono">{z.usuarios}</td>
                </tr>
              ))}
              {dataZonas.length === 0 && (
                <tr><td colSpan={5} className="roled-empty">Sin datos.</td></tr>
              )}
              {/* Fila de totales */}
              {dataZonas.length > 0 && (
                <tr style={{ borderTop: "2px solid var(--border-soft)", fontWeight: 600 }}>
                  <td>Total</td>
                  <td className="mono">{dataZonas.reduce((s, z) => s + z.viñedos, 0)}</td>
                  <td className="mono">{dataZonas.reduce((s, z) => s + z.sensores, 0)}</td>
                  <td className="mono">{dataZonas.reduce((s, z) => s + z.drones, 0)}</td>
                  <td className="mono">{dataZonas.reduce((s, z) => s + z.usuarios, 0)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Últimos usuarios registrados</span>
            <Link to="/ti/cuentas" style={{ fontSize: 12, color: "var(--accent-mint-deep)", textDecoration: "none", fontWeight: 500 }}>Ver todos →</Link>
          </div>
          <table className="roled-table">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Empresa</th></tr>
            </thead>
            <tbody>
              {ultimosUsuarios.map((u) => (
                <tr key={u.idusuario}>
                  <td>{u.nombreusuario}</td>
                  <td className="mono">{u.correo}</td>
                  <td>{u.rol}</td>
                  <td>{u.nombreempresa}</td>
                </tr>
              ))}
              {ultimosUsuarios.length === 0 && (
                <tr><td colSpan={4} className="roled-empty">No hay usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}