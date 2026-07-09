import { NavLink } from "react-router-dom";
import "../styles/Usuario/theme.css";
import "../styles/Usuario/Sidebar.css";

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

const ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠", end: true },
  { to: "/dashboard/mapa", label: "Mapa", icon: "🗺️" },
  { to: "/dashboard/lecturas", label: "Lecturas", icon: "📊" },
  { to: "/dashboard/drones", label: "Drones", icon: "🚁" },
  { to: "/dashboard/enfermedades", label: "Enfermedades", icon: "🧬" },
  { to: "/dashboard/pipeline", label: "Pipeline", icon: "🔗" },
  { to: "/dashboard/alertas", label: "Alertas", icon: "🚨" },
];

export default function Sidebar({ open, onNavigate }: SidebarProps) {
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

      <nav className="tabbar" aria-label="Navegación principal">
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