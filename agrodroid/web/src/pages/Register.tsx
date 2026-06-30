import React, { useState } from "react";
import "../styles/Register.css";
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

  const handleEmpresaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsuarioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Payload de empresa (POST /empresas)
    const empresaPayload = {
      ruc: empresa.ruc,
      nombreEmpresa: empresa.nombreEmpresa,
      direccion: empresa.direccion,
    };

    // Payload de usuario (POST /usuarios)
    // Empresa_idEmpresa se asigna con el id devuelto al crear la empresa
    const usuarioPayload = {
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      contrasenia: usuario.contrasenia,
      rol: usuario.rol,
      Empresa_idEmpresa: 1,
    };

    console.log("Registro de empresa:", empresaPayload);
    console.log("Registro de usuario:", usuarioPayload);

    // Aquí iría la llamada al backend (fetch / axios)
  };

  return (
    <div className="wrapper">
      <div className="register-container">
        <h2>Registro de Cuenta</h2>
        <div className="network-node">Gateway de Acceso: SSL/TLS Activo</div>

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
                required
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
            <span className="divider-text">INFORMACIÓN DEL USUARIO</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreUsuario">Usuario:</label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                className="input-field"
                placeholder="Ej: agronomo_vinyedo1"
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

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="rol">Rol:</label>
              <select
                id="rol"
                name="rol"
                className="input-field"
                value={usuario.rol}
                onChange={handleUsuarioChange}
              >
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-submit">
            Crear Cuenta
          </button>

          <Link to="/login" className="back-link">
          ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>

        <div className="security-footer">
          Petición enrutada por el Router de Oficina Central hacia el contenedor
        </div>
      </div>
    </div>
  );
};

export default Register;