import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LecturaSensor, Sensor } from "../../types/models";
import "../../styles/Usuario/theme.css";

export interface SensorReadingsViewProps {
  sensores: Sensor[];
  sensorSeleccionadoId: string | null;
  onCambiarSensor: (sensorId: string) => void;
  fechaInicio: string;
  fechaFin: string;
  onCambiarRango: (fechaInicio: string, fechaFin: string) => void;
  lecturas: LecturaSensor[];
}

/** Vista 3 — histórico de lecturas de un sensor: gráfico + tabla. */
export default function SensorReadingsView({
  sensores,
  sensorSeleccionadoId,
  onCambiarSensor,
  fechaInicio,
  fechaFin,
  onCambiarRango,
  lecturas,
}: SensorReadingsViewProps) {
  const datosGrafico = lecturas.map((l) => ({
    etiqueta: l.hora,
    valor: l.valor,
  }));

  return (
    <div className="readings-view">
      <header className="view-header">
        <h1>Lecturas de sensores</h1>
        <p className="view-header__sub">
          Historial de valores capturados por sensor
        </p>
      </header>

      <div className="panel readings-view__filtros">
        <div className="filtro-campo">
          <label htmlFor="filtro-sensor">Sensor</label>

          <select
            id="filtro-sensor"
            value={sensorSeleccionadoId ?? ""}
            onChange={(e) => onCambiarSensor(e.target.value)}
          >
            {sensores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-campo">
          <label htmlFor="filtro-desde">Desde</label>

          <input
            id="filtro-desde"
            type="date"
            value={fechaInicio}
            onChange={(e) => onCambiarRango(e.target.value, fechaFin)}
          />
        </div>

        <div className="filtro-campo">
          <label htmlFor="filtro-hasta">Hasta</label>

          <input
            id="filtro-hasta"
            type="date"
            value={fechaFin}
            onChange={(e) => onCambiarRango(fechaInicio, e.target.value)}
          />
        </div>
      </div>

      <div className="panel readings-view__chart">
        <div className="panel-header">
          <span className="panel-title">Serie de tiempo</span>
        </div>

        <div className="readings-view__chart-area">
          {datosGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={datosGrafico}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border-soft)"
                  vertical={false}
                />

                <XAxis
                  dataKey="etiqueta"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                />

                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  width={36}
                />

                <Tooltip
                  contentStyle={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--text-secondary)" }}
                />

                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--accent-water)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--accent-water)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-hint">
              No hay lecturas para el rango seleccionado.
            </p>
          )}
        </div>
      </div>

      <div className="panel readings-view__table">
        <div className="panel-header">
          <span className="panel-title">Detalle de lecturas</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sensor</th>
                <th>Valor</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>

            <tbody>
              {lecturas.map((l) => (
                <tr key={l.id}>
                  <td>
                    {sensores.find((s) => s.id === l.sensorId)?.nombre ??
                      l.sensorId}
                  </td>

                  <td className="mono-cell">{l.valor}</td>

                  <td className="mono-cell">{l.fecha}</td>

                  <td className="mono-cell">{l.hora}</td>
                </tr>
              ))}

              {lecturas.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-hint">
                    Sin registros en este rango de fechas.
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