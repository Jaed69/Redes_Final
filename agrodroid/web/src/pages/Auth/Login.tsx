import React, {useState} from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import "../../styles/Auth/Login.css";



const Login: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = (await api.post("/auth/login", { correo, contrasenia })) as any;

    // Guardar el token
    localStorage.setItem("token", data.token);

    // Guardar información del usuario (opcional)
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    // Redirigir según el rol. Recarga el documento para que App.tsx
    // re-monte con token presente y sus useEffect de carga disparen
    // contra la API ya autenticada (sin dependen de navigate que no
    // remonta el árbol y deja los efectos en [] sin disparar).
    switch (data.usuario.rol) {
      case "admin":
        window.location.href = "/admin";
        break;
      case "monitor":
        window.location.href = "/dashboard";
        break;
      case "cliente":
        window.location.href = "/cliente";
        break;
      case "ti":
        window.location.href = "/ti/cuentas";
        break;
      default:
        window.location.href = "/dashboard";
        break;
    }

  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Error al conectar con el servidor.");
  }
};

  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Portal de Autenticación</h2>
        
        <form onSubmit={handleSubmit}>
          
        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="input-field"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="input-field"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-user">
          Iniciar sesión
        </button>

        <Link to="/register" className="register-link">
        ¿Aún no tienes cuenta? Regístrate
        </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;