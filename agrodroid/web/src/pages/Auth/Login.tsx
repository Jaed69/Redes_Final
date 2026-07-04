import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth/Login.css";



const Login: React.FC = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo,
        contrasenia,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.mensaje);
      return;
    }

    // Guardar el token
    localStorage.setItem("token", data.token);

    // Guardar información del usuario (opcional)
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    console.log(data);

    // Redirigir según el rol
    if (data.usuario.rol === "Administrador") {
      navigate("/admin_dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor.");
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