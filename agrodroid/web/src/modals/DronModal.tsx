import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { vinedosMock } from "../mockData";
import type { DronAdmin } from "../types/models";

interface DronModalProps {
  open: boolean;
  dron: DronAdmin | null;
  onGuardar: (data: Omit<DronAdmin, "id" | "vinedoNombre" | "bateria">) => void;
  onClose: () => void;
}

const VACIO = {
  codigo: "",
  modelo: "",
  vinedoId: vinedosMock[0]?.id ?? "",
  estado: "Disponible" as DronAdmin["estado"],
};

export default function DronModal({ open, dron, onGuardar, onClose }: DronModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(dron ? { ...dron } : VACIO);
  }, [dron, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={dron ? "Editar dron" : "Nuevo dron"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="dron-codigo">Código</label>
            <input
              id="dron-codigo"
              required
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="dron-modelo">Modelo</label>
            <input
              id="dron-modelo"
              required
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="dron-vinedo">Viñedo</label>
            <select
              id="dron-vinedo"
              value={form.vinedoId}
              onChange={(e) => setForm({ ...form, vinedoId: e.target.value })}
            >
              {vinedosMock.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form__field">
            <label htmlFor="dron-estado">Estado</label>
            <select
              id="dron-estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as DronAdmin["estado"] })}
            >
              <option value="Disponible">Disponible</option>
              <option value="En vuelo">En vuelo</option>
              <option value="Mantenimiento">Mantenimiento</option>
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