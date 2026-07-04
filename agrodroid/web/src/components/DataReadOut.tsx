import "../styles/Usuario/DataReadOut.css";

export type ReadoutTone = "vine" | "water" | "copper" | "violet" | "neutral";

interface DataReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: ReadoutTone;
}

/**
 * "Readout chip": presenta un valor como si viniera de un instrumento de
 * campo (mono + unidad pequeña). Se reutiliza en sensores, drones,
 * coordenadas e IA para que cualquier dato numérico se lea igual en
 * toda la app.
 */
export default function DataReadout({ label, value, unit, tone = "neutral" }: DataReadoutProps) {
  return (
    <div className={`readout readout--${tone}`}>
      <span className="readout__label">{label}</span>
      <span className="readout__value">
        {value}
        {unit ? <span className="readout__unit">{unit}</span> : null}
      </span>
    </div>
  );
}