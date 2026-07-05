import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { empresasMock } from "../mockData";
import type { VinedoAdmin } from "../types/models";

interface VinedoModalProps {
  open: boolean;
  vinedo: VinedoAdmin | null;
  onGuardar: (data: Omit<VinedoAdmin, "id" | "empresaNombre">) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  empresaId: empresasMock[0]?.id ?? "",
  latitud: 0,
  longitud: 0,
  areaHectareas: 0,
  estado: "Activo" as VinedoAdmin["estado"],
};

export default function VinedoModal({ open, vinedo, onGuardar, onClose }: VinedoModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(vinedo ? { ...vinedo } : VACIO);
  }, [vinedo, open]);

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
              {empresasMock.map((emp) => (
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
            <label htmlFor="vinedo-lat">Latitud</label>
            <input
              id="vinedo-lat"
              type="number"
              step="0.0001"
              required
              value={form.latitud}
              onChange={(e) => setForm({ ...form, latitud: Number(e.target.value) })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="vinedo-long">Longitud</label>
            <input
              id="vinedo-long"
              type="number"
              step="0.0001"
              required
              value={form.longitud}
              onChange={(e) => setForm({ ...form, longitud: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="vinedo-area">Área (ha)</label>
            <input
              id="vinedo-area"
              type="number"
              step="0.01"
              required
              value={form.areaHectareas}
              onChange={(e) => setForm({ ...form, areaHectareas: Number(e.target.value) })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="vinedo-estado">Estado</label>
            <select
              id="vinedo-estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as VinedoAdmin["estado"] })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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