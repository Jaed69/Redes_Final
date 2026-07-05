import { useMemo } from "react";
import type { Alerta, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

interface ClienteReportesProps {
  vinedos: Vinedo[];
  alertas: Alerta[];
  empresaId: string;
}

type Fila = {
  vinedo: string;
  alertas: number;
  alertasActivas: number;
  alertasResueltas: number;
  score: number;
};

export default function ClienteReportes({ vinedos, alertas, empresaId }: ClienteReportesProps) {
  const filas = useMemo<Fila[]>(() => {
    const misVinedos = vinedos;
    return misVinedos
      .map((v) => {
        const delVinedo = alertas.filter((a) => a.vinedoId === v.id);
        const activas = delVinedo.filter((a) => a.estado !== "Resuelta").length;
        const resueltas = delVinedo.filter((a) => a.estado === "Resuelta").length;
        return {
          vinedo: v.nombre,
          alertas: delVinedo.length,
          alertasActivas: activas,
          alertasResueltas: resueltas,
          score: delVinedo.length,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [vinedos, alertas]);

  return (
    <div className="readings-view">
      <header className="view-header">
        <h1>Reportes comparativos</h1>
        <p className="view-header__sub">Comparativa de viñedos de tu empresa por número de alertas</p>
      </header>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Ranking de alertas por viñedo</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
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
                  <td className="mono-cell">{i + 1}</td>
                  <td>{f.vinedo}</td>
                  <td className="mono-cell">{f.alertas}</td>
                  <td className="mono-cell">{f.alertasActivas}</td>
                  <td className="mono-cell">{f.alertasResueltas}</td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-hint">
                    No hay viñedos asociados a tu empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {empresaId === "" && <p className="empty-hint">Aviso: no se identificó tu empresa.</p>}
    </div>
  );
}