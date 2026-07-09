import { useState } from "react";
import DataReadout from "../../components/DataReadOut";
import DiseaseImagePlaceholder from "../../components/DiseaseImagePlaceholder";
import type { Dron } from "../../types/models";
import "../../styles/Usuario/DronesView.css";

export interface DronesViewProps {
  drones: Dron[];
}

/**
 * Vista 4 — drones activos por viñedo y su galería de capturas.
 * Nota: la tabla Dron no tiene columna de estado ni de batería en la BD
 * (ver gap 2 en models.ts), así que esta vista solo muestra lo que el
 * backend realmente entrega hoy: nombre, viñedo y sus imágenes.
 */
export default function DronesView({ drones }: DronesViewProps) {
  const [dronSeleccionadoId, setDronSeleccionadoId] = useState<string | null>(drones[0]?.id ?? null);
  const dronSeleccionado = drones.find((d) => d.id === dronSeleccionadoId) ?? null;

  return (
    <div className="drones-view">
      <header className="view-header">
        <h1>Drones &amp; imágenes</h1>
        <p className="view-header__sub">Drones desplegados y capturas realizadas en cada viñedo</p>
      </header>

      <section className="drones-view__grid">
        {drones.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`drone-card ${d.id === dronSeleccionadoId ? "is-active" : ""}`}
            onClick={() => setDronSeleccionadoId(d.id)}
          >
            <div className="drone-card__top">
              <span className="drone-card__nombre">{d.nombre}</span>
            </div>
            <span className="drone-card__vinedo">{d.vinedoNombre}</span>
            <div className="drone-card__readouts">
              <DataReadout label="Capturas" value={d.imagenes.length} tone="copper" />
            </div>
          </button>
        ))}
        {drones.length === 0 && <p className="empty-hint">No hay drones registrados para este viñedo.</p>}
      </section>

      {dronSeleccionado && (
        <section className="panel drones-view__galeria">
          <div className="panel-header">
            <span className="panel-title">Capturas de {dronSeleccionado.nombre}</span>
            <span className="eyebrow">{dronSeleccionado.imagenes.length} imágenes</span>
          </div>
          <div className="galeria-grid">
            {dronSeleccionado.imagenes.map((img) => (
              <figure key={img.id} className="galeria-item">
                <div className="galeria-item__img" style={{ padding: 0, overflow: "hidden" }}>
                  <DiseaseImagePlaceholder enfermedad="Captura de dron" confianza={0} />
                </div>
                <figcaption>
                  <span className="galeria-item__fecha">
                    {img.fecha} · {img.hora}
                  </span>
                  <div className="galeria-item__meta">
                    <DataReadout label="Lat" value={img.latitud.toFixed(4)} tone="copper" />
                    <DataReadout label="Long" value={img.longitud.toFixed(4)} tone="copper" />
                    <DataReadout label="Resolución" value={`${img.anchoPx}×${img.altoPx}`} tone="copper" />
                    <DataReadout label="Tamaño" value={img.tamanoArchivo} tone="copper" />
                  </div>
                </figcaption>
              </figure>
            ))}
            {dronSeleccionado.imagenes.length === 0 && (
              <p className="empty-hint">Este dron aún no tiene capturas registradas.</p>
            )}
          </div>
        </section>
      )}

    </div>
  );
}