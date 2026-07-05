import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { EmpresaAdmin } from "../types/models";

interface EmpresaModalProps {
  open: boolean;
  empresa: EmpresaAdmin | null;
  onGuardar: (data: { nombre: string; ruc: string; direccion: string }) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  ruc: "",
  direccion: "",
};

export default function EmpresaModal({ open, empresa, onGuardar, onClose }: EmpresaModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      empresa
        ? { nombre: empresa.nombre, ruc: empresa.ruc, direccion: empresa.direccion }
        : VACIO
    );
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
            <label htmlFor="empresa-ruc">RUC (11 dígitos)</label>
            <input
              id="empresa-ruc"
              required
              maxLength={11}
              pattern="\d{11}"
              inputMode="numeric"
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value.replace(/\D/g, "") })}
            />
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