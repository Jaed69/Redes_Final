import type { ReactNode } from "react";
import "../styles/Usuario/Statcard.css";

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "vine" | "water" | "copper" | "violet" | "critical";
  icon?: ReactNode;
  hint?: string;
}

export default function StatCard({ label, value, tone = "vine", icon, hint }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="eyebrow">{label}</span>
        {icon ? <span className="stat-card__icon">{icon}</span> : null}
      </div>
      <span className="stat-card__value">{value}</span>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </div>
  );
}