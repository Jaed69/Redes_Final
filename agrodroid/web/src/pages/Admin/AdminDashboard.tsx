import StatCard from "../../components/StatCard";
import { dronesMock, empresasMock, sensoresMock, usuariosMock, vinedosMock } from "../../mockData";
import "../../styles/Admin/AdminDashboard.css";


/** Mock de alertas recientes solo para esta vista (no existe un módulo de alertas en el admin todavía). */
const alertasRecientesMock = [
  { id: "1", descripcion: "Humedad del suelo fuera de rango en Viñedo Santa Rosa", fecha: "2026-07-03", estado: "critico" as const },
  { id: "2", descripcion: "Detección de Oidio en Viñedo San José", fecha: "2026-07-02", estado: "en_proceso" as const },
  { id: "3", descripcion: "Batería baja en dron W_Norte_2", fecha: "2026-07-01", estado: "resuelto" as const },
];

/** Vista principal del panel de administrador: indicadores globales de la plataforma. */
export default function AdminDashboard() {
  const usuariosRecientes = [...usuariosMock].slice(-5).reverse();
  const sensoresOffline = sensoresMock.filter((s) => s.estado === "Inactivo");

  return (
    <div className="admin-dashboard">
      <header className="view-header">
        <h1>Dashboard</h1>
        <p className="view-header__sub">Resumen general de la plataforma AgroVina</p>
      </header>

      <section className="admin-dashboard__kpis">
        <StatCard label="Empresas" value={empresasMock.length} tone="vine" icon="🏢" />
        <StatCard label="Viñedos" value={vinedosMock.length} tone="vine" icon="🌱" />
        <StatCard label="Usuarios registrados" value={usuariosMock.length} tone="water" icon="👤" />
        <StatCard label="Sensores instalados" value={sensoresMock.length} tone="water" icon="📡" />
        <StatCard label="Drones registrados" value={dronesMock.length} tone="copper" icon="🚁" />
        <StatCard
          label="Alertas activas"
          value={alertasRecientesMock.filter((a) => a.estado !== "resuelto").length}
          tone="critical"
          icon="🚨"
        />
      </section>

      <section className="admin-dashboard__grid">
        <div className="panel admin-dashboard__panel">
          <div className="panel-header">
            <span className="panel-title">Últimos usuarios registrados</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuariosRecientes.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td className="mono-cell">{u.correo}</td>
                    <td>{u.empresaNombre}</td>
                    <td>
                      <span className={`estado-pill ${u.estado === "Activo" ? "normal" : "offline"}`}>
                        {u.estado}
                      </span>
                    </td>
                  </tr>
                ))}
                {usuariosRecientes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-hint">
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
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alertasRecientesMock.map((a) => (
                  <tr key={a.id}>
                    <td className="data-table__desc">{a.descripcion}</td>
                    <td className="mono-cell">{a.fecha}</td>
                    <td>
                      <span className={`estado-pill ${a.estado}`}>
                        <span className={`status-dot ${a.estado}`} />
                        {a.estado.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel admin-dashboard__panel admin-dashboard__panel--full">
          <div className="panel-header">
            <span className="panel-title">Sensores offline</span>
            <span className="eyebrow">{sensoresOffline.length} sensores</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Viñedo</th>
                  <th>Coordenadas</th>
                </tr>
              </thead>
              <tbody>
                {sensoresOffline.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>{s.tipo}</td>
                    <td>{s.vinedoNombre}</td>
                    <td className="mono-cell">
                      {s.latitud.toFixed(4)}, {s.longitud.toFixed(4)}
                    </td>
                  </tr>
                ))}
                {sensoresOffline.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-hint">
                      Todos los sensores están en línea.
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