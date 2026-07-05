import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { Usuario } from "../../types/models";
import "../../styles/Usuario/theme.css";
import "../../styles/Shared/ClienteTi.css";

interface TiLayoutProps {
  usuario: Usuario;
}

const ITEMS = [
  { to: "/ti", label: "Dashboard", icon: "🏠", end: true },
  { to: "/ti/cuentas", label: "Cuentas", icon: "👤" },
  { to: "/ti/sistema", label: "Sistema", icon: "🛠" },
];

export default function TiLayout({ usuario }: TiLayoutProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell--roled">
      <header className="roled-header">
        <button type="button" className="roled-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menú">
          ☰
        </button>
        <div className="roled-header__brand">
          <span className="roled-header__brand-dot" aria-hidden="true" />
          AgroVina · TI
        </div>
        <span className="roled-header__user">{usuario.nombre}</span>
        <button type="button" className="roled-header__btn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <div className="roled-body">
        <aside className={`roled-sidebar ${open ? "is-open" : ""}`}>
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `roled-sidebar__link ${isActive ? "is-active" : ""}`
              }
            >
              <span className="roled-sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </aside>
        {open && <div className="roled-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

        <main className="roled-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}