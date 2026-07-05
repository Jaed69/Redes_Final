import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { EmpresaAdmin, UsuarioAdmin } from "../types/models";

interface UsuarioModalProps {
  open: boolean;
  usuario: UsuarioAdmin | null;
  empresas: EmpresaAdmin[];
  onGuardar: (data: {
    nombre: string;
    correo: string;
    contrasenia: string;
    rol: string;
    empresaId: string;
  }) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  correo: "",
  contrasenia: "",
  rol: "monitor",
  empresaId: "",
};

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "monitor", label: "Operador / Monitor" },
  { value: "cliente", label: "Cliente / Productor" },
  { value: "ti", label: "TI" },
];

export default function UsuarioModal({ open, usuario, empresas, onGuardar, onClose }: UsuarioModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      usuario
        ? {
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasenia: "",
            rol: usuario.rol,
            empresaId: usuario.empresaId,
          }
        : { ...VACIO, empresaId: empresas[0]?.id ?? "" }
    );
  }, [usuario, open, empresas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={usuario ? "Editar usuario" : "Nuevo usuario"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__field">
          <label htmlFor="usuario-nombre">Nombre</label>
          <input
            id="usuario-nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="usuario-correo">Correo</label>
            <input
              id="usuario-correo"
              type="email"
              required
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="usuario-contrasenia">
              Contraseña {usuario && <span style={{ fontWeight: 400 }}>(dejar vacío para no cambiarla)</span>}
            </label>
            <input
              id="usuario-contrasenia"
              type="password"
              required={!usuario}
              value={form.contrasenia}
              onChange={(e) => setForm({ ...form, contrasenia: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="usuario-rol">Rol</label>
            <select
              id="usuario-rol"
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form__field">
            <label htmlFor="usuario-empresa">Empresa</label>
            <select
              id="usuario-empresa"
              value={form.empresaId}
              onChange={(e) => setForm({ ...form, empresaId: e.target.value })}
            >
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}