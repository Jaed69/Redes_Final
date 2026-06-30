import React from "react";
import "../styles/Login.css";

const Login: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Portal de Autenticación</h2>
        
        <div className="form-group">
          <label>Usuario o Fundo (ID Corporativo):</label>
          <input
            type="text"
            className="input-field"
            defaultValue="agronomo_vinyedo1"
          />
        </div>

        <div className="form-group">
          <label>Contraseña de Red:</label>
          <input
            type="password"
            className="input-field"
            defaultValue="********"
          />
        </div>

        <div className="divider">
          <span className="divider-text">SELECCIONE ROL DE SIMULACIÓN</span>
        </div>

        <a href="/user_dashboard" className="btn btn-user">
          Entrar como Usuario (Fundo / Agrónomo)
        </a>

        <a href="/admin_dashboard" className="btn btn-admin">
          Entrar como Administrador (SysAdmin)
        </a>

        <div className="security-footer">
          Petición enrutada por el Router de Oficina Central hacia el contenedor
        </div>
      </div>
    </div>
  );
};

export default Login;