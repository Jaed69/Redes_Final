import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { Usuario } from "../types/models";

const RUTA_INICIO_POR_ROL: Record<string, string> = {
  admin: "/admin",
  monitor: "/dashboard",
  cliente: "/proximamente",
  ti: "/proximamente",
};

type RequireRoleProps = {
  roles: string[];
};

export default function RequireRole({ roles }: RequireRoleProps) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}") as Usuario;

  const rolNoPermitido = Boolean(token) && !roles.includes(usuario.rol);

  useEffect(() => {
    if (rolNoPermitido) {
      alert("No tienes acceso a esta sección.");
    }
  }, [rolNoPermitido]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolNoPermitido) {
    const rutaInicio = RUTA_INICIO_POR_ROL[usuario.rol] || "/login";
    return <Navigate to={rutaInicio} replace />;
  }

  return <Outlet />;
}
