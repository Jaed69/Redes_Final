import { useMemo, useState } from "react";
import DataReadout from "../../components/DataReadOut";
import DiseaseImagePlaceholder from "../../components/DiseaseImagePlaceholder";
import DeteccionModal from "../../components/DeteccionModal";
import type { Alerta, DeteccionEnfermedad, Dron } from "../../types/models";
import "../../styles/Usuario/theme.css";

export interface DiseaseDetectionViewProps {
  detecciones: DeteccionEnfermedad[];
  alertas?: Alerta[];
  drones?: Dron[];
}

export default function DiseaseDetectionView({ detecciones, alertas = [], drones = [] }: DiseaseDetectionViewProps) {
  const [filtro, setFiltro] = useState<string>("todas");
  const [seleccionada, setSeleccionada] = useState<DeteccionEnfermedad | null>(null);

  const enfermedades = useMemo(
    () => Array.from(new Set(detecciones.map((d) => d.enfermedad))).sort(),
    [detecciones]
  );

  const filtradas =
    filtro === "todas" ? detecciones : detecciones.filter((d) => d.enfermedad === filtro);

  const dronDeDeteccion = useMemo(() => {
    const imagenADron = new Map<string, string>();
    drones.forEach((dr) => dr.imagenes.forEach((im) => imagenADron.set(im.id, dr.nombre)));
    return (d: DeteccionEnfermedad) => imagenADron.get(d.imagenId) ?? "—";
  }, [drones]);

  const alertaDeDeteccion = useMemo(() => {
    return (d: DeteccionEnfermedad) =>
      alertas.find((a) => a.tipo === "Enfermedad" && a.descripcion.includes(d.enfermedad.split(" ")[0]));
  }, [alertas]);

  return (
    <div className="disease-view">
      <header className="view-header">
        <h1>Detección de enfermedades</h1>
        <p className="view-header__sub">Resultados del análisis de imágenes por IA y su nivel de confianza</p>
      </header>

      <div className="panel disease-view__filtro">
        <label htmlFor="filtro-enfermedad">Enfermedad</label>
        <select id="filtro-enfermedad" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todas">Todas</option>
          {enfermedades.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <span className="eyebrow disease-view__count">{filtradas.length} detecciones</span>
      </div>

      <section className="disease-view__grid">
        {filtradas.map((d) => (
          <article
            key={d.id}
            className="disease-card"
            style={{ cursor: "pointer" }}
            onClick={() => setSeleccionada(d)}
          >
            <div
              className="disease-card__img"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <DiseaseImagePlaceholder enfermedad={d.enfermedad} confianza={d.nivelConfianza} />
            </div>
            <div className="disease-card__body">
              <span className="disease-card__nombre">{d.enfermedad}</span>
              <DataReadout label="Confianza" value={d.nivelConfianza.toFixed(1)} unit="%" tone="violet" />
              <div className="disease-card__confianza-bar">
                <div
                  className="disease-card__confianza-fill"
                  style={{ width: `${Math.min(100, Math.max(0, d.nivelConfianza))}%` }}
                />
              </div>
              <span className="disease-card__fecha mono-cell">{d.fecha}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{dronDeDeteccion(d)}</span>
            </div>
          </article>
        ))}
        {filtradas.length === 0 && <p className="empty-hint">No hay detecciones para este filtro.</p>}
      </section>

      {seleccionada && (
        <DeteccionModal
          deteccion={seleccionada}
          dronNombre={dronDeDeteccion(seleccionada)}
          alerta={alertaDeDeteccion(seleccionada)}
          onClose={() => setSeleccionada(null)}
        />
      )}
    </div>
  );
}