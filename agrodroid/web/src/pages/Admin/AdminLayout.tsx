import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar.tsx";
import type { Notificacion, Usuario } from "../../types/models";
import "../../styles/Usuario/theme.css";

interface AdminLayoutProps {
  usuario: Usuario | null | undefined;
  notificaciones?: Notificacion[];
  backendOnline?: boolean;
  onMarcarLeida?: (notificacionId: string) => void;
}

/**
 * Reutiliza exactamente el mismo shell (app-shell / app-shell__body /
 * app-shell__content) que AppLayout del operador — mismo layout, mismo
 * CSS, solo cambia qué Navbar/Sidebar renderiza adentro.
 */
export default function AdminLayout({
  usuario,
  notificaciones = [],
  backendOnline = true,
  onMarcarLeida,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <AdminNavbar
        usuario={usuario}
        notificaciones={notificaciones}
        backendOnline={backendOnline}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onMarcarLeida={onMarcarLeida}
      />
      <div className="app-shell__body">
        <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}