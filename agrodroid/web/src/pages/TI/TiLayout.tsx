import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import type { Usuario } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Usuario/Sidebar.css";

interface TiLayoutProps {
  usuario: Usuario;
}

const ITEMS = [
  { to: "/ti/cuentas", label: "Cuentas", icon: "👤" },
  { to: "/ti/sistema", label: "Sistema", icon: "🛠" },
];

export default function TiLayout({ usuario }: TiLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="cliente-header">
        <button type="button" className="sidebar-toggle" onClick={() => setOpen((v) => !v)}>
          ☰
        </button>
        <span className="cliente-header__title">AgroVina · TI</span>
        <span className="cliente-header__user">{usuario.nombre}</span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </header>
      <div className="app-shell__body">
        <aside className={`sidebar ${open ? "is-open" : ""}`}>
          <nav className="sidebar__nav">
            {ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
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
        {open && <div className="sidebar__scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}