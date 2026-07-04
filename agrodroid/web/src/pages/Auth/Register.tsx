import React, { useState } from "react";
import "../../styles/Auth/Register.css";
import { Link, useNavigate } from "react-router-dom";

interface EmpresaForm {
  ruc: string;
  nombreEmpresa: string;
  direccion: string;
}

interface UsuarioForm {
  nombreUsuario: string;
  correo: string;
  contrasenia: string;
  rol: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState<EmpresaForm>({
    ruc: "",
    nombreEmpresa: "",
    direccion: "",
  });

  const [usuario, setUsuario] = useState<UsuarioForm>({
    nombreUsuario: "",
    correo: "",
    contrasenia: "",
    rol: "Administrador",
  });

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsuarioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Crear empresa
    const empresaResponse = await fetch("http://localhost:3000/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ruc: empresa.ruc,
        nombreEmpresa: empresa.nombreEmpresa,
        direccion: empresa.direccion,
      }),
    });

    const empresaData = await empresaResponse.json();

    if (!empresaResponse.ok) {
      alert(empresaData.mensaje);
      return;
    }

    // 🔥 IMPORTANTE: backend devuelve idempresa (minúscula)
    const idEmpresa = empresaData.idempresa;

    // 2. Crear usuario
    const usuarioResponse = await fetch(
      "http://localhost:3000/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreUsuario: usuario.nombreUsuario,
          correo: usuario.correo,
          contrasenia: usuario.contrasenia,
          rol: "Administrador",

          // 🔥 ESTE ES EL NOMBRE QUE TU BACKEND ESPERA
          Empresa_idEmpresa: idEmpresa,
        }),
      }
    );

    const usuarioData = await usuarioResponse.json();

    if (!usuarioResponse.ok) {
      alert(usuarioData.mensaje);
      return;
    }

    alert("Registro exitoso");
    navigate("/login");

  } catch (error) {
    console.error(error);
    alert("Error de conexión");
  }
};

  return (
    <div className="wrapper">
      <div className="register-container">
        <h2>Registro de Cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className="divider">
            <span className="divider-text">INFORMACIÓN DE LA EMPRESA</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ruc">RUC:</label>
              <input
                id="ruc"
                name="ruc"
                type="text"
                className="input-field"
                placeholder="12345678913"
                value={empresa.ruc}
                onChange={handleEmpresaChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombreEmpresa">Nombre de la Empresa:</label>
              <input
                id="nombreEmpresa"
                name="nombreEmpresa"
                type="text"
                className="input-field"
                placeholder="Ej: Viñedo San José"
                value={empresa.nombreEmpresa}
                onChange={handleEmpresaChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección (Fundo / Sede):</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className="input-field"
              placeholder="Ej: Ica"
              value={empresa.direccion}
              onChange={handleEmpresaChange}
              required
            />
          </div>

          <div className="divider">
            <span className="divider-text">INFORMACIÓN DEL ADMINISTRADOR</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreUsuario">Usuario:</label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                className="input-field"
                placeholder="Ej: admin_sanjose"
                value={usuario.nombreUsuario}
                onChange={handleUsuarioChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input
                id="correo"
                name="correo"
                type="email"
                className="input-field"
                placeholder="correo@ejemplo.com"
                value={usuario.correo}
                onChange={handleUsuarioChange}
                required
              />
            </div>
          </div>

            <div className="form-group">
              <label htmlFor="contrasenia">Contraseña:</label>
              <input
                id="contrasenia"
                name="contrasenia"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={usuario.contrasenia}
                onChange={handleUsuarioChange}
                required
              />
            </div>

          <button type="submit" className="btn btn-submit">
            Crear Cuenta
          </button>

          <Link to="/login" className="back-link">
          ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;