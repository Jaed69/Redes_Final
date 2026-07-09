import { useMemo } from "react";
import DiseaseImagePlaceholder from "../../components/DiseaseImagePlaceholder";
import type { Alerta, DeteccionEnfermedad, Dron, Imagen, Notificacion } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface PipelineDeteccionProps {
  drones: Dron[];
  detecciones: DeteccionEnfermedad[];
  alertas: Alerta[];
  notificaciones: Notificacion[];
}

type PipelineItem = {
  deteccion: DeteccionEnfermedad;
  dron: Dron;
  imagen: Imagen;
  alerta?: Alerta;
  notif?: Notificacion;
};

export default function PipelineDeteccion({ drones, detecciones, alertas, notificaciones }: PipelineDeteccionProps) {
  const pipeline = useMemo(() => {
    const imagenPorId = new Map<string, { dron: Dron; imagen: Imagen }>();
    drones.forEach((dr) =>
      dr.imagenes.forEach((im) => imagenPorId.set(im.id, { dron: dr, imagen: im }))
    );

    const items: PipelineItem[] = [];
    detecciones.forEach((det) => {
      const im = imagenPorId.get(det.imagenId);
      if (!im) return;

      const alerta = alertas.find(
        (a) => a.tipo === "Enfermedad" && a.descripcion.includes(det.enfermedad.split(" ")[0])
      );

      const notif = alerta
        ? notificaciones.find((n) => n.alertaDescripcion?.includes(alerta.descripcion.slice(0, 20)))
        : undefined;

      items.push({ deteccion: det, dron: im.dron, imagen: im.imagen, alerta, notif });
    });
    return items;
  }, [drones, detecciones, alertas, notificaciones]);

  return (
    <div>
      <header className="view-header">
        <h1>Pipeline de detección</h1>
        <p className="view-header__sub">
          Flujo completo: dron → captura → análisis IA → detección → alerta → notificación
        </p>
      </header>

      {pipeline.length === 0 ? (
        <p className="roled-empty">No hay detecciones con imágenes asociadas para mostrar el pipeline.</p>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {pipeline.map(({ deteccion: d, dron, imagen, alerta, notif }) => (
            <div
              key={d.id}
              style={{
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--surface)",
              }}
            >
              {/* Header del caso */}
              <div
                style={{
                  padding: "10px 16px",
                  background: "var(--surface-raised)",
                  borderBottom: "1px solid var(--border-soft)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                  {d.enfermedad} — {d.fecha}
                </span>
                <span className="eyebrow">{d.nivelConfianza.toFixed(1)}% confianza</span>
              </div>

              {/* Timeline horizontal: 5 etapas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 0,
                }}
              >
                {/* 1. Dron */}
                <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border-soft)" }}>
                  <div style={{ fontSize: 22 }}>🚁</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                    Dron
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>
                    {dron.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {dron.vinedoNombre}
                  </div>
                </div>

                {/* 2. Imagen */}
                <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border-soft)" }}>
                  <div style={{ fontSize: 22 }}>📸</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                    Captura
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", marginTop: 4 }}>
                    {imagen.fecha} · {imagen.hora}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                    {imagen.latitud.toFixed(4)}, {imagen.longitud.toFixed(4)}
                  </div>
                </div>

                {/* 3. IA */}
                <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border-soft)" }}>
                  <div style={{ fontSize: 22 }}>🧬</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                    Análisis IA
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>
                    {d.enfermedad}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--accent-violet)", fontWeight: 600, marginTop: 2 }}>
                    {d.nivelConfianza.toFixed(1)}% confianza
                  </div>
                </div>

                {/* 4. Alerta */}
                <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border-soft)" }}>
                  <div style={{ fontSize: 22 }}>🚨</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                    Alerta
                  </div>
                  {alerta ? (
                    <>
                      <div style={{ fontSize: 12, color: "var(--text-primary)", marginTop: 4, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {alerta.descripcion}
                      </div>
                      <span className={`roled-pill ${alerta.estado === "Resuelta" ? "roled-pill--ok" : alerta.estado === "En Proceso" ? "roled-pill--warn" : "roled-pill--bad"}`} style={{ marginTop: 4 }}>
                        {alerta.estado}
                      </span>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Sin alerta</div>
                  )}
                </div>

                {/* 5. Notificación */}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 22 }}>🔔</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                    Notificación
                  </div>
                  {notif ? (
                    <>
                      <div style={{ fontSize: 11, color: "var(--text-primary)", marginTop: 4, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {notif.mensaje}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                        → {notif.usuarioNombre}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Sin notificación</div>
                  )}
                </div>
              </div>

              {/* Placeholder de imagen + descripción */}
              {(d.descripcion || d.imagenUrl) && (
                <div style={{ borderTop: "1px solid var(--border-soft)", display: "flex", gap: 0 }}>
                  <div style={{ width: 160, height: 100, flexShrink: 0 }}>
                    <DiseaseImagePlaceholder enfermedad={d.enfermedad} confianza={d.nivelConfianza} />
                  </div>
                  <div style={{ padding: "10px 14px", flex: 1 }}>
                    {d.descripcion && (
                      <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{d.descripcion}</div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                      Imagen {imagen.anchoPx}×{imagen.altoPx}px · {imagen.tamanoArchivo} bytes
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}