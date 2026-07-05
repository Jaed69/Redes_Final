import { NavLink } from "react-router-dom";
import "../styles/Usuario/Sidebar.css";

interface AdminSidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

const ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
  { to: "/admin/empresas", label: "Empresas", icon: "🏢" },
  { to: "/admin/vinedos", label: "Viñedos", icon: "🌱" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "👤" },
  { to: "/admin/sensores", label: "Sensores", icon: "📡" },
  { to: "/admin/drones", label: "Drones", icon: "🚁" },
  { to: "/admin/umbrales", label: "Umbrales", icon: "🎚️" },
];

/**
 * Reutiliza exactamente los mismos estilos que el Sidebar del operador
 * (src/styles/Sidebar.css) — solo cambia el menú y el prefijo de ruta.
 */
export default function AdminSidebar({ open, onNavigate }: AdminSidebarProps) {
  return (
    <>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <nav className="sidebar__nav">
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar__link ${isActive ? "is-active" : ""}`}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="sidebar__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <div className="sidebar__scrim" onClick={onNavigate} aria-hidden="true" />}

      <nav className="tabbar" aria-label="Navegación principal del administrador">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `tabbar__link ${isActive ? "is-active" : ""}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span className="tabbar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}