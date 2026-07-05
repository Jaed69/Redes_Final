import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Notificacion, Usuario } from "../types/models";
import "../styles/Usuario/theme.css";
import "../styles/Usuario/Navbar.css";

interface AdminNavbarProps {
  usuario: Usuario | null | undefined;
  notificaciones?: Notificacion[];
  backendOnline: boolean;
  onToggleSidebar?: () => void;
  onMarcarLeida?: (notificacionId: string) => void;
  onVerPerfil?: () => void;
  onCerrarSesion?: () => void;
}

/**
 * Reutiliza las mismas clases visuales que el Navbar del operador
 * (src/styles/Navbar.css). Se quita el selector de empresa/viñedo porque
 * el administrador ve la plataforma completa, no un viñedo a la vez.
 */
export default function AdminNavbar({
  usuario,
  notificaciones = [],
  backendOnline,
  onToggleSidebar,
  onMarcarLeida,
  onVerPerfil,
  onCerrarSesion,
}: AdminNavbarProps) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaMenu, setVistaMenu] = useState<"acciones" | "perfil">("acciones");
  const [notifAbierta, setNotifAbierta] = useState(false);

  const sinLeer = notificaciones.filter((n) => !n.leida).length;
  const recientes = notificaciones.slice(0, 5);

  const toggleNotif = () => {
    setNotifAbierta((v) => !v);
    setMenuAbierto(false);
  };

  const toggleUserMenu = () => {
    setMenuAbierto((v) => !v);
    setVistaMenu("acciones");
    setNotifAbierta(false);
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
        <span className="eyebrow">Panel de administrador</span>
      </div>

      <div className="navbar__right">
        <span className={`navbar__status ${backendOnline ? "is-online" : "is-offline"}`}>
          <span className="status-dot normal" style={{ display: backendOnline ? "inline-block" : "none" }} />
          <span className="status-dot critico" style={{ display: backendOnline ? "none" : "inline-block" }} />
          {backendOnline ? "Sistema en línea" : "Sin conexión"}
        </span>

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
            <span className="navbar__avatar">{usuario?.nombre?.charAt(0).toUpperCase() ?? "A"}</span>
            <span className="navbar__user-name">{usuario?.nombre ?? "Administrador"}</span>
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
              <div className="navbar__perfil-avatar">{usuario?.nombre?.charAt(0).toUpperCase() ?? "A"}</div>
              <span className="navbar__perfil-nombre">{usuario?.nombre ?? "Administrador"}</span>
              <span className="navbar__perfil-dato">{usuario?.correo ?? "—"}</span>
              <span className="navbar__perfil-rol">{usuario?.rol ?? "Administrador"}</span>
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