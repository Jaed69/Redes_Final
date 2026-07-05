import { useNavigate } from "react-router-dom";
import type { Usuario } from "../../types/models";
import "../../styles/Shared/ComingSoonView.css";

const ROL_LARGO_POR_ROL: Record<string, string> = {
  cliente: "Cliente/Productor",
  ti: "TI",
};

export default function ComingSoonView() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}") as Usuario;

  const rolLabel = ROL_LARGO_POR_ROL[usuario.rol] || "tu perfil";

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <div className="app-shell__content coming-soon">
        <div className="coming-soon__card">
          <span className="coming-soon__badge">Próximamente</span>
          <h1 className="coming-soon__heading">Próximamente</h1>
          <p className="coming-soon__body">
            Esta sección para tu perfil de {rolLabel} aún no está disponible —
            llegará en una próxima fase del proyecto. Por ahora puedes cerrar
            sesión.
          </p>
          <button
            type="button"
            className="coming-soon__button"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
