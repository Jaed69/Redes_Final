import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { DronAdmin, VinedoAdmin } from "../types/models";

interface DronModalProps {
  open: boolean;
  dron: DronAdmin | null;
  vinedos: VinedoAdmin[];
  onGuardar: (data: { nombre: string; vinedoId: string }) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  vinedoId: "",
};

export default function DronModal({ open, dron, vinedos, onGuardar, onClose }: DronModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      dron
        ? { nombre: dron.nombre, vinedoId: dron.vinedoId }
        : { ...VACIO, vinedoId: vinedos[0]?.id ?? "" }
    );
  }, [dron, open, vinedos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={dron ? "Editar dron" : "Nuevo dron"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__field">
          <label htmlFor="dron-nombre">Nombre</label>
          <input
            id="dron-nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="admin-form__field">
          <label htmlFor="dron-vinedo">Viñedo</label>
          <select
            id="dron-vinedo"
            value={form.vinedoId}
            onChange={(e) => setForm({ ...form, vinedoId: e.target.value })}
          >
            {vinedos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre}
              </option>
            ))}
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