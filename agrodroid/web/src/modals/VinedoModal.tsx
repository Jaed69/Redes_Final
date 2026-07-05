import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { EmpresaAdmin, VinedoAdmin } from "../types/models";

interface VinedoModalProps {
  open: boolean;
  vinedo: VinedoAdmin | null;
  empresas: EmpresaAdmin[];
  onGuardar: (data: {
    nombre: string;
    ubicacion: string;
    areaHectareas: number;
    empresaId: string;
  }) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  empresaId: "",
  ubicacion: "",
  areaHectareas: 0,
};

export default function VinedoModal({ open, vinedo, empresas, onGuardar, onClose }: VinedoModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      vinedo
        ? {
            nombre: vinedo.nombre,
            empresaId: vinedo.empresaId,
            ubicacion: vinedo.ubicacion,
            areaHectareas: vinedo.areaHectareas,
          }
        : { ...VACIO, empresaId: empresas[0]?.id ?? "" }
    );
  }, [vinedo, open, empresas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={vinedo ? "Editar viñedo" : "Nuevo viñedo"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="vinedo-empresa">Empresa</label>
            <select
              id="vinedo-empresa"
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
          <div className="admin-form__field">
            <label htmlFor="vinedo-nombre">Nombre</label>
            <input
              id="vinedo-nombre"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="vinedo-ubicacion">Ubicación</label>
            <input
              id="vinedo-ubicacion"
              required
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="vinedo-area">Área (ha)</label>
            <input
              id="vinedo-area"
              type="number"
              step="0.01"
              min="0"
              required
              value={form.areaHectareas}
              onChange={(e) => setForm({ ...form, areaHectareas: Number(e.target.value) })}
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