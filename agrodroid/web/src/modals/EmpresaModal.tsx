import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { EmpresaAdmin } from "../types/models";

interface EmpresaModalProps {
  open: boolean;
  empresa: EmpresaAdmin | null;
  onGuardar: (data: Omit<EmpresaAdmin, "id">) => void;
  onClose: () => void;
}

const VACIO: Omit<EmpresaAdmin, "id"> = {
  nombre: "",
  ruc: "",
  direccion: "",
  responsable: "",
  estado: "Activo",
};

export default function EmpresaModal({ open, empresa, onGuardar, onClose }: EmpresaModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(empresa ? { ...empresa } : VACIO);
  }, [empresa, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={empresa ? "Editar empresa" : "Nueva empresa"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__field">
          <label htmlFor="empresa-nombre">Nombre</label>
          <input
            id="empresa-nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="empresa-ruc">RUC</label>
            <input
              id="empresa-ruc"
              required
              maxLength={11}
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="empresa-responsable">Responsable</label>
            <input
              id="empresa-responsable"
              required
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form__field">
          <label htmlFor="empresa-direccion">Dirección</label>
          <input
            id="empresa-direccion"
            required
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
        </div>

        <div className="admin-form__field">
          <label htmlFor="empresa-estado">Estado</label>
          <select
            id="empresa-estado"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value as EmpresaAdmin["estado"] })}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
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