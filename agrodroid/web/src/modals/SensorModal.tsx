import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { vinedosMock } from "../mockData";
import type { SensorAdmin } from "../types/models";

interface SensorModalProps {
  open: boolean;
  sensor: SensorAdmin | null;
  onGuardar: (data: Omit<SensorAdmin, "id" | "vinedoNombre" | "estado">) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  tipo: "Humedad" as SensorAdmin["tipo"],
  vinedoId: vinedosMock[0]?.id ?? "",
  latitud: 0,
  longitud: 0,
};

export default function SensorModal({ open, sensor, onGuardar, onClose }: SensorModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(sensor ? { ...sensor } : VACIO);
  }, [sensor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={sensor ? "Editar sensor" : "Nuevo sensor"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="sensor-nombre">Nombre</label>
            <input
              id="sensor-nombre"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="sensor-tipo">Tipo</label>
            <select
              id="sensor-tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as SensorAdmin["tipo"] })}
            >
              <option value="Humedad">Humedad</option>
              <option value="Temperatura">Temperatura</option>
              <option value="Combinado">Combinado</option>
            </select>
          </div>
        </div>

        <div className="admin-form__field">
          <label htmlFor="sensor-vinedo">Viñedo</label>
          <select
            id="sensor-vinedo"
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

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="sensor-lat">Latitud</label>
            <input
              id="sensor-lat"
              type="number"
              step="0.0001"
              required
              value={form.latitud}
              onChange={(e) => setForm({ ...form, latitud: Number(e.target.value) })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="sensor-long">Longitud</label>
            <input
              id="sensor-long"
              type="number"
              step="0.0001"
              required
              value={form.longitud}
              onChange={(e) => setForm({ ...form, longitud: Number(e.target.value) })}
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