type Props = {
  enfermedad: string;
  confianza: number;
  size?: number;
};

const COLORES: Record<string, { bg: string; accent: string; icon: string }> = {
  Mildiu: { bg: "#3d4f3a", accent: "#8fbc8f", icon: "🍃" },
  Oidio: { bg: "#5a5a5e", accent: "#d3d3d3", icon: "🌾" },
  Botrytis: { bg: "#4a3528", accent: "#c4a882", icon: "🍇" },
  Antracnosis: { bg: "#2d2d2d", accent: "#888", icon: "🍂" },
  Yesca: { bg: "#5c4a1e", accent: "#daa520", icon: "🌿" },
  "Podredumbre Acida": { bg: "#4a1a1a", accent: "#cd5c5c", icon: "🔴" },
  Desconocida: { bg: "#3a3a3a", accent: "#aaa", icon: "❓" },
};

export default function DiseaseImagePlaceholder({ enfermedad, confianza, size = 100 }: Props) {
  const c = COLORES[enfermedad] ?? COLORES["Desconocida"];
  const gid = `grad-${enfermedad.replace(/\s/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 150"
      width={size === 100 ? "100%" : size}
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", borderRadius: 8 }}
      role="img"
      aria-label={`Imagen analizada: ${enfermedad} ${confianza.toFixed(1)}%`}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.bg} />
          <stop offset="100%" stopColor={c.accent} stopOpacity={0.3} />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill={`url(#${gid})`} />
      <circle cx="100" cy="55" r="28" fill={c.accent} opacity={0.15} />
      <text x="100" y="65" textAnchor="middle" fontSize="32" opacity={0.6}>
        {c.icon}
      </text>
      <text x="100" y="105" textAnchor="middle" fontSize="14" fill="white" fontWeight="600" opacity={0.9}>
        {enfermedad.length > 16 ? enfermedad.slice(0, 14) + "…" : enfermedad}
      </text>
      <text x="100" y="125" textAnchor="middle" fontSize="20" fill={c.accent} fontWeight="700">
        {confianza.toFixed(1)}%
      </text>
    </svg>
  );
}