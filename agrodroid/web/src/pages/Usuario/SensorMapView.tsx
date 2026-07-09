import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import DataReadout from "../../components/DataReadOut";
import type { DeteccionEnfermedad, Dron, Sensor, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

export interface SensorMapViewProps {
  sensores: Sensor[];
  vinedos: Vinedo[];
  detecciones?: DeteccionEnfermedad[];
  drones?: Dron[];
}

const COLOR_ENFERMEDAD: Record<string, string> = {
  Mildiu: "#8fbc8f",
  Oidio: "#d3d3d3",
  Botrytis: "#c4a882",
  Antracnosis: "#888",
  Yesca: "#daa520",
  "Podredumbre Acida": "#cd5c5c",
  Desconocida: "#aaa",
};

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

function iconoDeteccion(enfermedad: string, confianza: number) {
  const color = COLOR_ENFERMEDAD[enfermedad] ?? "#aaa";
  const radio = Math.round(10 + (confianza / 100) * 14);
  return divIcon({
    className: "deteccion-marker",
    html: `<span style="background:${color};width:${radio * 2}px;height:${radio * 2}px;border-radius:50%;border:2px solid white;display:block;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></span>`,
    iconSize: [radio * 2, radio * 2],
  });
}

function RecentrarMapa({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], map.getZoom(), { animate: true });
  return null;
}

export default function SensorMapView({ sensores, vinedos, detecciones = [], drones = [] }: SensorMapViewProps) {
  const [seleccionado, setSeleccionado] = useState<Sensor | null>(null);
  const [capa, setCapa] = useState<"sensores" | "detecciones">("sensores");

  const nombreVinedo = useMemo(() => {
    const mapa = new Map(vinedos.map((v) => [v.id, v.nombre]));
    return (sensor: Sensor) =>
      sensor.vinedoNombre ||
      (sensor.vinedoId ? mapa.get(sensor.vinedoId) : undefined) ||
      "Sin viñedo";
  }, [vinedos]);

  // Mapa imagenId → { lat, long, dronNombre,.fecha, hora }
  const imagenMap = useMemo(() => {
    const m = new Map<string, { latitud: number; longitud: number; dronNombre: string; fecha: string; hora: string }>();
    drones.forEach((dr) =>
      dr.imagenes.forEach((im) =>
        m.set(im.id, { latitud: im.latitud, longitud: im.longitud, dronNombre: dr.nombre, fecha: im.fecha, hora: im.hora })
      )
    );
    return m;
  }, [drones]);

  const deteccionesConCoords = useMemo(
    () =>
      detecciones
        .map((d) => {
          const im = imagenMap.get(d.imagenId);
          return im ? { det: d, lat: im.latitud, lng: im.longitud, dron: im.dronNombre, fechaImg: im.fecha, horaImg: im.hora } : null;
        })
        .filter((x): x is { det: DeteccionEnfermedad; lat: number; lng: number; dron: string; fechaImg: string; horaImg: string } => x !== null),
    [detecciones, imagenMap]
  );

  const centro: [number, number] =
    sensores.length
      ? [sensores[0].latitud, sensores[0].longitud]
      : deteccionesConCoords.length
      ? [deteccionesConCoords[0].lat, deteccionesConCoords[0].lng]
      : [-12.046374, -77.042793];

  return (
    <div className="sensor-map-view">
      <header className="view-header">
        <h1>Mapa de sensores y detecciones</h1>
        <p className="view-header__sub">
          Ubicación física de sensores y detecciones de plagas por IA
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => setCapa("sensores")}
            className={`sidebar__link ${capa === "sensores" ? "is-active" : ""}`}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border-soft)", cursor: "pointer", fontSize: 13 }}
          >
            📡 Sensores ({sensores.length})
          </button>
          <button
            type="button"
            onClick={() => setCapa("detecciones")}
            className={`sidebar__link ${capa === "detecciones" ? "is-active" : ""}`}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border-soft)", cursor: "pointer", fontSize: 13 }}
          >
            🧬 Detecciones ({deteccionesConCoords.length})
          </button>
        </div>
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
              <RecentrarMapa lat={seleccionado.latitud} lng={seleccionado.longitud} />
            )}

            {capa === "sensores" &&
              sensores.map((s) => (
                <Marker
                  key={s.id}
                  position={[s.latitud, s.longitud]}
                  icon={iconoPorEstado(s.estado)}
                  eventHandlers={{ click: () => setSeleccionado(s) }}
                >
                  <Popup>
                    <div className="sensor-popup">
                      <strong>{s.nombre}</strong>
                      <span>{nombreVinedo(s)}</span>
                      <span className="sensor-popup__coords">
                        {s.latitud.toFixed(5)}, {s.longitud.toFixed(5)}
                      </span>
                      {s.ultimaLectura && (
                        <span>Última lectura: {s.ultimaLectura.valor}</span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {capa === "detecciones" &&
              deteccionesConCoords.map(({ det, lat, lng, dron, fechaImg, horaImg }) => (
                <Marker
                  key={det.id}
                  position={[lat, lng]}
                  icon={iconoDeteccion(det.enfermedad, det.nivelConfianza)}
                >
                  <Popup>
                    <div className="sensor-popup">
                      <strong>{det.enfermedad}</strong>
                      <span>Confianza: {det.nivelConfianza.toFixed(1)}%</span>
                      <span>Dron: {dron}</span>
                      <span>Captura: {fechaImg} · {horaImg}</span>
                      <span>Detección: {det.fecha}</span>
                      {det.descripcion && <span>{det.descripcion}</span>}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <aside className="sensor-map-view__sidebar panel">
          <div className="panel-header">
            <span className="panel-title">
              {capa === "sensores" ? `Sensores (${sensores.length})` : `Detecciones (${deteccionesConCoords.length})`}
            </span>
          </div>

          <div className="sensor-list">
            {capa === "sensores" && sensores.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sensor-item ${seleccionado?.id === s.id ? "is-active" : ""}`}
                onClick={() => setSeleccionado(s)}
              >
                <div className="sensor-item__top">
                  <span className={`status-dot ${s.estado}`} />
                  <span className="sensor-item__nombre">{s.nombre}</span>
                </div>
                <span className="sensor-item__vinedo">{nombreVinedo(s)}</span>
                <DataReadout
                  label="Coordenadas"
                  value={`${s.latitud.toFixed(4)}, ${s.longitud.toFixed(4)}`}
                  tone="water"
                />
              </button>
            ))}

            {capa === "detecciones" && deteccionesConCoords.map(({ det, dron, fechaImg }) => (
              <div
                key={det.id}
                className="sensor-item"
                style={{ cursor: "default" }}
              >
                <div className="sensor-item__top">
                  <span
                    className="status-dot"
                    style={{ background: COLOR_ENFERMEDAD[det.enfermedad] ?? "#aaa" }}
                  />
                  <span className="sensor-item__nombre">{det.enfermedad}</span>
                </div>
                <span className="sensor-item__vinedo">Dron: {dron}</span>
                <DataReadout
                  label="Confianza"
                  value={`${det.nivelConfianza.toFixed(1)}%`}
                  tone="violet"
                />
                <DataReadout
                  label="Captura"
                  value={fechaImg}
                  tone="neutral"
                />
              </div>
            ))}

            {capa === "sensores" && sensores.length === 0 && (
              <p className="empty-hint">No hay sensores para este viñedo.</p>
            )}
            {capa === "detecciones" && deteccionesConCoords.length === 0 && (
              <p className="empty-hint">No hay detecciones con coordenadas.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}