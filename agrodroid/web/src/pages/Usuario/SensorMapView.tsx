import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import DataReadout from "../../components/DataReadOut";
import type { Sensor, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

export interface SensorMapViewProps {
  sensores: Sensor[];
  vinedos: Vinedo[];
}

function iconoPorEstado(estado: Sensor["estado"]) {
  const color =
    estado === "critico"
      ? "var(--critical)"
      : estado === "advertencia"
      ? "var(--warning)"
      : estado === "sin_datos"
      ? "var(--offline)"
      : "var(--success)";

  return divIcon({
    className: "sensor-marker",
    html: `<span style="background:${color}"></span>`,
    iconSize: [16, 16],
  });
}

/** Recentra el mapa cuando cambia el sensor seleccionado en la lista. */
function RecentrarMapa({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], map.getZoom(), { animate: true });
  return null;
}

/** Vista 2 — mapa GIS con la ubicación física de los sensores. */
export default function SensorMapView({
  sensores,
  vinedos,
}: SensorMapViewProps) {
  const [seleccionado, setSeleccionado] = useState<Sensor | null>(null);

  const nombreVinedo = useMemo(() => {
    const mapa = new Map(vinedos.map((v) => [v.id, v.nombre]));

    return (sensor: Sensor) =>
      sensor.vinedoNombre ||
      (sensor.vinedoId ? mapa.get(sensor.vinedoId) : undefined) ||
      "Sin viñedo";
  }, [vinedos]);

  const centro: [number, number] = sensores.length
    ? [sensores[0].latitud, sensores[0].longitud]
    : [-12.046374, -77.042793];

  return (
    <div className="sensor-map-view">
      <header className="view-header">
        <h1>Mapa de sensores</h1>
        <p className="view-header__sub">
          Ubicación física de los sensores desplegados en el viñedo
        </p>
      </header>

      <div className="sensor-map-view__layout">
        <div className="sensor-map-view__map panel">
          <MapContainer
            center={centro}
            zoom={15}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {seleccionado && (
              <RecentrarMapa
                lat={seleccionado.latitud}
                lng={seleccionado.longitud}
              />
            )}

            {sensores.map((s) => (
              <Marker
                key={s.id}
                position={[s.latitud, s.longitud]}
                icon={iconoPorEstado(s.estado)}
                eventHandlers={{
                  click: () => setSeleccionado(s),
                }}
              >
                <Popup>
                  <div className="sensor-popup">
                    <strong>{s.nombre}</strong>

                    <span>{nombreVinedo(s)}</span>

                    <span className="sensor-popup__coords">
                      {s.latitud.toFixed(5)}, {s.longitud.toFixed(5)}
                    </span>

                    {s.ultimaLectura && (
                      <span>
                        Última lectura: {s.ultimaLectura.valor}
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="sensor-map-view__sidebar panel">
          <div className="panel-header">
            <span className="panel-title">
              Sensores ({sensores.length})
            </span>
          </div>

          <div className="sensor-list">
            {sensores.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sensor-item ${
                  seleccionado?.id === s.id ? "is-active" : ""
                }`}
                onClick={() => setSeleccionado(s)}
              >
                <div className="sensor-item__top">
                  <span className={`status-dot ${s.estado}`} />
                  <span className="sensor-item__nombre">{s.nombre}</span>
                </div>

                <span className="sensor-item__vinedo">
                  {nombreVinedo(s)}
                </span>

                <DataReadout
                  label="Coordenadas"
                  value={`${s.latitud.toFixed(4)}, ${s.longitud.toFixed(4)}`}
                  tone="water"
                />
              </button>
            ))}

            {sensores.length === 0 && (
              <p className="empty-hint">
                No hay sensores para este viñedo.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}