import Modal from "./Modal";
import DataReadout from "./DataReadOut";
import DiseaseImagePlaceholder from "./DiseaseImagePlaceholder";
import type { Alerta, DeteccionEnfermedad } from "../types/models";

type Props = {
  deteccion: DeteccionEnfermedad;
  dronNombre?: string;
  alerta?: Alerta;
  onClose: () => void;
};

export default function DeteccionModal({ deteccion, dronNombre, alerta, onClose }: Props) {
  return (
    <Modal open={true} title="Detalle de detección" onClose={onClose} widthPx={560}>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ borderRadius: 8, overflow: "hidden", height: 200 }}>
          <DiseaseImagePlaceholder enfermedad={deteccion.enfermedad} confianza={deteccion.nivelConfianza} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <DataReadout label="Enfermedad" value={deteccion.enfermedad} tone="violet" />
          <DataReadout label="Confianza" value={`${deteccion.nivelConfianza.toFixed(1)}%`} tone="violet" />
          <DataReadout label="Fecha" value={deteccion.fecha} tone="neutral" />
          <DataReadout label="Dron" value={dronNombre ?? "—"} tone="copper" />
        </div>

        <div className="disease-card__confianza-bar" style={{ height: 8, borderRadius: 4, overflow: "hidden", background: "var(--border-soft)" }}>
          <div
            className="disease-card__confianza-fill"
            style={{ width: `${Math.min(100, Math.max(0, deteccion.nivelConfianza))}%`, height: "100%" }}
          />
        </div>

        {deteccion.descripcion && (
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Descripción</div>
            <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0 }}>{deteccion.descripcion}</p>
          </div>
        )}

        {alerta && (
          <div style={{ padding: "12px 14px", border: "1px solid var(--border-soft)", borderRadius: 8, background: "var(--surface-raised)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Alerta asociada</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{alerta.descripcion}</span>
              <span className={`roled-pill ${alerta.estado === "Resuelta" ? "roled-pill--ok" : alerta.estado === "En Proceso" ? "roled-pill--warn" : "roled-pill--bad"}`}>
                {alerta.estado}
              </span>
            </div>
          </div>
        )}

        {deteccion.imagenUrl && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Imagen original: {deteccion.imagenUrl}
          </div>
        )}
      </div>
    </Modal>
  );
}