import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

type ApiEmpresa = { idempresa: number };

export default function TiDashboard() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [ultimosUsuarios, setUltimosUsuarios] = useState<ApiUsuario[]>([]);
  const [estado, setEstado] = useState<EstadoSistema | null>(null);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [usuarios, empresas, estadoSistema] = await Promise.all([
          api.get("/usuarios") as Promise<ApiUsuario[]>,
          api.get("/empresas") as Promise<ApiEmpresa[]>,
          api.get("/system/status") as Promise<EstadoSistema>,
        ]);
        setTotalUsuarios(usuarios.length);
        setTotalEmpresas(empresas.length);
        setUltimosUsuarios([...usuarios].slice(-5).reverse());
        setEstado(estadoSistema);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) setErrorEstado(e.message);
      }
    })();
  }, []);

  const envFaltantes = estado
    ? Object.entries(estado.env).filter(([, v]) => v !== "set")
    : [];
  const envOk = estado ? envFaltantes.length === 0 : false;

  return (
    <div>
      <header className="view-header">
        <h1>Dashboard TI</h1>
        <p className="view-header__sub">Resumen de cuentas, empresas y estado del sistema</p>
      </header>

      <section className="roled-kpis">
        <StatCard label="Usuarios" value={totalUsuarios} tone="water" icon="👤" />
        <StatCard label="Empresas" value={totalEmpresas} tone="vine" icon="🏢" />
        <StatCard
          label="Base de datos"
          value={estado?.db === "ok" ? "OK" : estado?.db === "error" ? "Fail" : "…"}
          tone={estado?.db === "ok" ? "vine" : "critical"}
          icon="🗄"
        />
        <StatCard
          label="Variables de entorno"
          value={estado ? `${6 - envFaltantes.length}/6` : "…"}
          tone={envOk ? "vine" : "critical"}
          icon="⚙"
        />
      </section>

      <section className="roled-grid">
        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Últimos usuarios registrados</span>
            <Link
              to="/ti/cuentas"
              style={{
                fontSize: 12,
                color: "var(--accent-mint-deep)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Ver todos →
            </Link>
          </div>
          <table className="roled-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Empresa</th>
              </tr>
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
                <tr>
                  <td colSpan={4} className="roled-empty">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="roled-panel">
          <div className="roled-panel__title">
            <span>Estado del sistema</span>
            <Link
              to="/ti/sistema"
              style={{
                fontSize: 12,
                color: "var(--accent-mint-deep)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Ver detalle →
            </Link>
          </div>
          {errorEstado ? (
            <p className="roled-empty">{errorEstado}</p>
          ) : estado ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Base de datos</span>
                <span
                  className={`roled-pill ${estado.db === "ok" ? "roled-pill--ok" : "roled-pill--bad"}`}
                >
                  {estado.db === "ok" ? "Conectada" : "Sin conexión"}
                </span>
              </div>
              {Object.entries(estado.env).map(([k, v]) => (
                <div
                  key={k}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span className="mono" style={{ fontSize: 13 }}>
                    {k}
                  </span>
                  <span
                    className={`roled-pill ${v === "set" ? "roled-pill--ok" : "roled-pill--bad"}`}
                  >
                    {v === "set" ? "Configurada" : "Falta"}
                  </span>
                </div>
              ))}
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  marginTop: 4,
                }}
              >
                {estado.timestamp}
              </div>
            </div>
          ) : (
            <p className="roled-empty">Cargando…</p>
          )}
        </div>
      </section>
    </div>
  );
}