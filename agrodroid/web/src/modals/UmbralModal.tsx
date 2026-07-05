import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import type { SensorAdmin, UmbralAdmin } from "../types/models";

interface UmbralModalProps {
  open: boolean;
  umbral: UmbralAdmin | null;
  sensores: SensorAdmin[];
  onGuardar: (data: {
    sensorId: string;
    valorMinimo: number;
    valorMaximo: number;
    descripcion: string;
  }) => void;
  onClose: () => void;
}

const VACIO = {
  sensorId: "",
  valorMinimo: 0,
  valorMaximo: 0,
  descripcion: "",
};

export default function UmbralModal({ open, umbral, sensores, onGuardar, onClose }: UmbralModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(
      umbral
        ? {
            sensorId: umbral.sensorId,
            valorMinimo: umbral.valorMinimo,
            valorMaximo: umbral.valorMaximo,
            descripcion: umbral.descripcion,
          }
        : { ...VACIO, sensorId: sensores[0]?.id ?? "" }
    );
  }, [umbral, open, sensores]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={umbral ? "Editar umbral" : "Nuevo umbral"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__field">
          <label htmlFor="umbral-sensor">Sensor {umbral && <span style={{ fontWeight: 400 }}>(no editable)</span>}</label>
          <select
            id="umbral-sensor"
            value={form.sensorId}
            disabled={Boolean(umbral)}
            onChange={(e) => setForm({ ...form, sensorId: e.target.value })}
          >
            {sensores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field">
          <label htmlFor="umbral-descripcion">Descripción</label>
          <input
            id="umbral-descripcion"
            required
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="umbral-min">Valor mínimo</label>
            <input
              id="umbral-min"
              type="number"
              step="0.01"
              required
              value={form.valorMinimo}
              onChange={(e) => setForm({ ...form, valorMinimo: Number(e.target.value) })}
            />
          </div>
          <div className="admin-form__field">
            <label htmlFor="umbral-max">Valor máximo</label>
            <input
              id="umbral-max"
              type="number"
              step="0.01"
              required
              value={form.valorMaximo}
              onChange={(e) => setForm({ ...form, valorMaximo: Number(e.target.value) })}
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