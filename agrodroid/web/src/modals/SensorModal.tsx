import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { SensorAdmin, VinedoAdmin } from "../types/models";

interface SensorModalProps {
  open: boolean;
  sensor: SensorAdmin | null;
  vinedos: VinedoAdmin[];
  onGuardar: (data: {
    nombre: string;
    vinedoId: string;
    latitud: number;
    longitud: number;
  }) => void;
  onClose: () => void;
}

const VACIO = {
  nombre: "",
  vinedoId: "",
  latitud: 0,
  longitud: 0,
};

export default function SensorModal({ open, sensor, vinedos, onGuardar, onClose }: SensorModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      sensor
        ? {
            nombre: sensor.nombre,
            vinedoId: sensor.vinedoId,
            latitud: sensor.latitud,
            longitud: sensor.longitud,
          }
        : { ...VACIO, vinedoId: vinedos[0]?.id ?? "" }
    );
  }, [sensor, open, vinedos]);

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
            <label htmlFor="sensor-vinedo">Viñedo</label>
            <select
              id="sensor-vinedo"
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
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="sensor-lat">Latitud</label>
            <input
              id="sensor-lat"
              type="number"
              step="0.0000001"
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
              step="0.0000001"
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