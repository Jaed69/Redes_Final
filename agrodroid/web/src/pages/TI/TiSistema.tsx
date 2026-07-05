import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../../styles/Usuario/theme.css";

type Estado = {
  db: string;
  env: Record<string, string>;
  timestamp: string;
};

export default function TiSistema() {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setError(null);
    try {
      const data = (await api.get("/system/status")) as Estado;
      setEstado(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al obtener estado");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="readings-view">
      <header className="view-header">
        <h1>Estado del sistema</h1>
        <p className="view-header__sub">Conectividad a la base de datos y variables de entorno activas</p>
      </header>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Salud general</span>
          <button type="button" className="btn btn-secondary" onClick={cargar}>
            Refrescar
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base de datos</td>
                <td>
                  <span className={`estado-pill ${estado?.db === "ok" ? "normal" : "offline"}`}>
                    {estado?.db === "ok" ? "Conectada" : "Sin conexión"}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Tiempo de consulta</td>
                <td className="mono-cell">{estado?.timestamp ?? "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Variables de entorno (sin valores secretos)</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estado
                ? Object.entries(estado.env).map(([k, v]) => (
                    <tr key={k}>
                      <td className="mono-cell">{k}</td>
                      <td>
                        <span className={`estado-pill ${v === "set" ? "normal" : "offline"}`}>
                          {v === "set" ? "Configurada" : "Falta"}
                        </span>
                      </td>
                    </tr>
                  ))
                : null}
              {!estado && !error && (
                <tr>
                  <td colSpan={2} className="empty-hint">
                    Cargando…
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={2} className="empty-hint">
                    {error}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}