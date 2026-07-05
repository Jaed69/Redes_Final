import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { api } from "../../services/api";
import "../../styles/Admin/AdminDashboard.css";

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
};

type UsuarioResumen = {
  id: string;
  nombre: string;
  correo: string;
  empresaNombre: string;
};

const EMPTY: Counts = {
  empresas: 0,
  vinedos: 0,
  usuarios: 0,
  sensores: 0,
  drones: 0,
  alertas: 0,
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [alertas, setAlertas] = useState<AlertaResumen[]>([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState<UsuarioResumen[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [empresas, vinedos, usuarios, sensores, drones, alertasApi] = await Promise.all([
          api.get("/empresas") as Promise<unknown[]>,
          api.get("/vinedos") as Promise<unknown[]>,
          api.get("/usuarios") as Promise<{ idusuario: number; nombreusuario: string; correo: string; nombreempresa: string }[]>,
          api.get("/sensores") as Promise<unknown[]>,
          api.get("/drones") as Promise<unknown[]>,
          api.get("/alertas") as Promise<{ idalerta: number; descripcion: string; estado: string; tipo: string }[]>,
        ]);

        setCounts({
          empresas: empresas.length,
          vinedos: vinedos.length,
          usuarios: usuarios.length,
          sensores: sensores.length,
          drones: drones.length,
          alertas: alertasApi.length,
        });

        setUsuariosRecientes(
          usuarios
            .slice(-5)
            .reverse()
            .map((u) => ({
              id: String(u.idusuario),
              nombre: u.nombreusuario,
              correo: u.correo,
              empresaNombre: u.nombreempresa,
            }))
        );

        setAlertas(
          alertasApi
            .slice(-5)
            .reverse()
            .map((a) => ({
              id: String(a.idalerta),
              descripcion: a.descripcion,
              estado: a.estado,
              tipo: a.tipo,
            }))
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Resumen general de la plataforma AgroVina</p>
      </header>

      <section className="admin-dashboard__kpis">
        <StatCard label="Empresas" value={counts.empresas} tone="vine" icon="🏢" />
        <StatCard label="Viñedos" value={counts.vinedos} tone="vine" icon="🌱" />
        <StatCard label="Usuarios" value={counts.usuarios} tone="water" icon="👤" />
        <StatCard label="Sensores" value={counts.sensores} tone="water" icon="📡" />
        <StatCard label="Drones" value={counts.drones} tone="copper" icon="🚁" />
        <StatCard label="Alertas" value={counts.alertas} tone="critical" icon="🚨" />
      </section>

      <section className="admin-dashboard__grid">
        <div className="panel admin-dashboard__panel">
          <div className="panel-header">
            <span className="panel-title">Últimos usuarios</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
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
                    <td className="mono-cell">{u.correo}</td>
                    <td>{u.empresaNombre}</td>
                  </tr>
                ))}
                {usuariosRecientes.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-hint">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel admin-dashboard__panel">
          <div className="panel-header">
            <span className="panel-title">Últimas alertas</span>
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
                {alertas.map((a) => (
                  <tr key={a.id}>
                    <td className="data-table__desc">{a.descripcion}</td>
                    <td>{a.tipo}</td>
                    <td>{a.estado}</td>
                  </tr>
                ))}
                {alertas.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-hint">
                      No hay alertas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}