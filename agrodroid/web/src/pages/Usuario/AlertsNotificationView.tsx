import { useState } from "react";
import { claseEstadoAlerta } from "../../types/models";
import type { Alerta, Notificacion } from "../../types/models";
import "../../styles/Usuario/AlertsNotificationView.css"

export interface AlertsNotificationsViewProps {
  alertas: Alerta[];
  notificaciones: Notificacion[];
  onMarcarLeida?: (notificacionId: string) => void;
}

type Tab = "alertas" | "notificaciones";

/**
 * Vista 6 — alertas del sistema y notificaciones derivadas, en dos pestañas.
 * `Alerta.estado` es un valor libre (viene de la tabla EstadoAlerta, editable
 * en BD: hoy "Pendiente" | "En Proceso" | "Resuelta"), así que en vez de un
 * Record exhaustivo usamos `claseEstadoAlerta` para resolver el tono
 * rojo/ámbar/verde sin romper si aparece un estado nuevo.
 */
export default function AlertsNotificationsView({
  alertas,
  notificaciones,
  onMarcarLeida,
}: AlertsNotificationsViewProps) {
  const [tab, setTab] = useState<Tab>("alertas");
  const sinLeer = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="alerts-view">
      <header className="view-header">
        <h1>Alertas y notificaciones</h1>
        <p className="view-header__sub">Avisos automáticos generados por sensores y detecciones de enfermedad</p>
      </header>

      <div className="alerts-view__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "alertas"}
          className={`alerts-tab ${tab === "alertas" ? "is-active" : ""}`}
          onClick={() => setTab("alertas")}
        >
          Alertas
          <span className="alerts-tab__count">{alertas.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "notificaciones"}
          className={`alerts-tab ${tab === "notificaciones" ? "is-active" : ""}`}
          onClick={() => setTab("notificaciones")}
        >
          Notificaciones
          {sinLeer > 0 && <span className="alerts-tab__count alerts-tab__count--unread">{sinLeer}</span>}
        </button>
      </div>

      {tab === "alertas" ? (
        <div className="panel alerts-list">
          {alertas.map((a) => {
            const tono = claseEstadoAlerta(a.estado);
            return (
              <div key={a.id} className={`alert-row alert-row--${tono}`}>
                <span className={`status-dot ${tono}`} />
                <div className="alert-row__body">
                  <div className="alert-row__top">
                    <span className="alert-row__origen">
                      {a.tipo === "Sensor" ? "📡" : "🧬"} {a.origenNombre ?? a.tipo}
                    </span>
                    {a.fecha && (
                      <span className="mono-cell">
                        {a.fecha} {a.hora && `· ${a.hora}`}
                      </span>
                    )}
                  </div>
                  <p className="alert-row__desc">{a.descripcion}</p>
                </div>
                <span className={`estado-pill ${tono}`}>{a.estado}</span>
              </div>
            );
          })}
          {alertas.length === 0 && <p className="empty-hint">No hay alertas registradas.</p>}
        </div>
      ) : (
        <div className="panel alerts-list">
          {notificaciones.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`notif-row ${n.leida ? "" : "is-unread"}`}
              onClick={() => onMarcarLeida?.(n.id)}
            >
              <span className={`notif-row__dot ${n.leida ? "" : "is-unread"}`} />
              <div className="notif-row__body">
                <span className="notif-row__titulo">{n.alertaDescripcion}</span>
                <p className="notif-row__mensaje">{n.mensaje}</p>
              </div>
              <span className="mono-cell">
                {n.fecha} · {n.hora}
              </span>
            </button>
          ))}
          {notificaciones.length === 0 && <p className="empty-hint">No tienes notificaciones.</p>}
        </div>
      )}
    </div>
  );
}