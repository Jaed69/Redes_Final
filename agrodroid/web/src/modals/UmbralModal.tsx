import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { sensoresMock } from "../mockData";
import type { UmbralAdmin } from "../types/models";

interface UmbralModalProps {
  open: boolean;
  umbral: UmbralAdmin | null;
  onGuardar: (data: Omit<UmbralAdmin, "id" | "sensorNombre" | "estado">) => void;
  onClose: () => void;
}

const VACIO = {
  sensorId: sensoresMock[0]?.id ?? "",
  variable: "Humedad" as UmbralAdmin["variable"],
  valorMinimo: 0,
  valorMaximo: 0,
};

export default function UmbralModal({ open, umbral, onGuardar, onClose }: UmbralModalProps) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(umbral ? { ...umbral } : VACIO);
  }, [umbral, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <Modal open={open} title={umbral ? "Editar umbral" : "Nuevo umbral"} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label htmlFor="umbral-sensor">Sensor</label>
            <select
              id="umbral-sensor"
              value={form.sensorId}
              onChange={(e) => setForm({ ...form, sensorId: e.target.value })}
            >
              {sensoresMock.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form__field">
            <label htmlFor="umbral-variable">Variable</label>
            <select
              id="umbral-variable"
              value={form.variable}
              onChange={(e) => setForm({ ...form, variable: e.target.value as UmbralAdmin["variable"] })}
            >
              <option value="Humedad">Humedad</option>
              <option value="Temperatura">Temperatura</option>
            </select>
          </div>
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