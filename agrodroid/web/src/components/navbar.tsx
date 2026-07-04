import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Empresa, Notificacion, Usuario, Vinedo } from "../types/models";
import "../styles/Usuario/theme.css";
import "../styles/Usuario/Navbar.css";

interface NavbarProps {
  usuario: Usuario | null | undefined;
  empresa: Empresa;
  vinedos: Vinedo[];
  vinedoActivoId: string | null;
  onCambiarVinedo: (vinedoId: string) => void;
  notificaciones: Notificacion[];
  backendOnline: boolean;
  onAbrirNotificaciones?: () => void;
  onToggleSidebar?: () => void;
  /** Se llama al hacer click en una notificación del dropdown de la campana. */
  onMarcarLeida?: (notificacionId: string) => void;
  /** Si no la pasas, "Perfil" solo despliega los datos del usuario en el propio menú. */
  onVerPerfil?: () => void;
  /**
   * Si no la pasas, "Cerrar sesión" limpia localStorage/sessionStorage y
   * redirige a "/". Pásala tú para conectar tu lógica real (revocar token
   * en el backend, useNavigate, etc.).
   */
  onCerrarSesion?: () => void;
}

export default function Navbar({
  usuario,
  empresa,
  vinedos,
  vinedoActivoId,
  onCambiarVinedo,
  notificaciones,
  backendOnline,
  onAbrirNotificaciones,
  onToggleSidebar,
  onMarcarLeida,
  onVerPerfil,
  onCerrarSesion,
}: NavbarProps) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaMenu, setVistaMenu] = useState<"acciones" | "perfil">("acciones");
  const [notifAbierta, setNotifAbierta] = useState(false);

  const sinLeer = notificaciones.filter((n) => !n.leida).length;
  const recientes = notificaciones.slice(0, 5);

  const toggleNotif = () => {
    setNotifAbierta((v) => !v);
    setMenuAbierto(false);
    onAbrirNotificaciones?.();
  };

  const toggleUserMenu = () => {
    setMenuAbierto((v) => !v);
    setVistaMenu("acciones");
    setNotifAbierta(false);
  };

  const handleVerTodas = () => {
    setNotifAbierta(false);
    navigate("/alertas");
  };

  const handlePerfil = () => {
    if (onVerPerfil) {
      onVerPerfil();
      setMenuAbierto(false);
    } else {
      setVistaMenu("perfil");
    }
  };

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    if (onCerrarSesion) {
      onCerrarSesion();
      return;
    }
    // Fallback por defecto: limpia cualquier sesión guardada localmente y recarga.
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-btn"
          aria-label="Alternar menú lateral"
          onClick={onToggleSidebar}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="navbar__brand">Viña Sensora</span>
      </div>

      <div className="navbar__center">
        <span className="navbar__empresa">{empresa.nombre}</span>
        <span className="navbar__divider">/</span>
        <select
          className="navbar__select"
          value={vinedoActivoId ?? ""}
          onChange={(e) => onCambiarVinedo(e.target.value)}
          aria-label="Seleccionar viñedo activo"
        >
          {vinedos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="navbar__right">
        

        <div className="navbar__notif">
          <button
            type="button"
            className="navbar__icon-btn"
            aria-label="Notificaciones"
            aria-haspopup="menu"
            aria-expanded={notifAbierta}
            onClick={toggleNotif}
          >
            🔔
            {sinLeer > 0 && <span className="navbar__badge">{sinLeer}</span>}
          </button>

          {notifAbierta && (
            <div className="navbar__dropdown navbar__dropdown--notif" role="menu">
              <div className="navbar__dropdown-header">
                <span>Notificaciones</span>
                {sinLeer > 0 && <span className="eyebrow">{sinLeer} sin leer</span>}
              </div>
              <div className="navbar__notif-list">
                {recientes.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`navbar__notif-item ${n.leida ? "" : "is-unread"}`}
                    onClick={() => {
                      onMarcarLeida?.(n.id);
                      setNotifAbierta(false);
                    }}
                  >
                    <span className={`navbar__notif-dot ${n.leida ? "" : "is-unread"}`} />
                    <span className="navbar__notif-body">
                      <span className="navbar__notif-titulo">{n.alertaDescripcion}</span>
                      <span className="navbar__notif-mensaje">{n.mensaje}</span>
                    </span>
                  </button>
                ))}
                {recientes.length === 0 && (
                  <p className="navbar__notif-empty">No tienes notificaciones.</p>
                )}
              </div>
              <button type="button" className="navbar__dropdown-footer" onClick={handleVerTodas}>
                Ver todas las alertas
              </button>
            </div>
          )}
        </div>

        <div className="navbar__user">
          <button
            type="button"
            className="navbar__user-btn"
            onClick={toggleUserMenu}
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
          >
            <span className="navbar__avatar">{usuario?.nombre?.charAt(0).toUpperCase() ?? "U"}</span>
            <span className="navbar__user-name">{usuario?.nombre ?? "Usuario"}</span>
          </button>

          {menuAbierto && vistaMenu === "acciones" && (
            <div className="navbar__dropdown" role="menu">
              <button type="button" role="menuitem" onClick={handlePerfil}>
                Perfil
              </button>
              <button type="button" role="menuitem" onClick={handleCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}

          {menuAbierto && vistaMenu === "perfil" && (
            <div className="navbar__dropdown navbar__dropdown--perfil" role="menu">
              <div className="navbar__perfil-avatar">{usuario?.nombre?.charAt(0).toUpperCase() ?? "U"}</div>
              <span className="navbar__perfil-nombre">{usuario?.nombre ?? "Usuario"}</span>
              <span className="navbar__perfil-dato">{usuario?.correo ?? "—"}</span>
              <span className="navbar__perfil-rol">{usuario?.rol ?? "—"}</span>
              <button type="button" className="navbar__dropdown-footer" onClick={() => setVistaMenu("acciones")}>
                ← Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}