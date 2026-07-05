import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/Sidebar";
import type { Empresa, Notificacion, Usuario, Vinedo } from "../../types/models";
import "../../styles/Usuario/theme.css";

interface AppLayoutProps {
  usuario: Usuario;
  empresa: Empresa;
  vinedos: Vinedo[];
  vinedoActivoId: string | null;
  onCambiarVinedo: (vinedoId: string) => void;
  notificaciones: Notificacion[];
  backendOnline: boolean;
  onMarcarLeida?: (notificacionId: string) => void;
}

/**
 * Shell de la aplicación. Las vistas (Dashboard, Mapa, Lecturas, etc.)
 * se renderizan mediante <Outlet /> mientras este componente conserva
 * el contexto activo (empresa / viñedo) fijo en la navbar.
 */
export default function AppLayout({
  usuario,
  empresa,
  vinedos,
  vinedoActivoId,
  onCambiarVinedo,
  notificaciones,
  backendOnline,
  onMarcarLeida,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar
        usuario={usuario}
        empresa={empresa}
        vinedos={vinedos}
        vinedoActivoId={vinedoActivoId}
        onCambiarVinedo={onCambiarVinedo}
        notificaciones={notificaciones}
        backendOnline={backendOnline}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onMarcarLeida={onMarcarLeida}
      />
      <div className="app-shell__body">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}