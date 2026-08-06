// Icone SVG disegnate a mano: ereditano currentColor e la dimensione dal
// contesto, cosa che le emoji non fanno. Stesso approccio già usato in
// fantaformulauno/components/icons.tsx.
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconCrown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function IconFoosball({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 5v14M8 9v6M16 9v6" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  );
}

export function IconTrophy({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
      <path d="M12 14v3M9 20h6M10 17h4" />
    </svg>
  );
}

export function IconHandshake({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11 7l-2.5 2.5a1.8 1.8 0 0 0 2.5 2.5L13 10l3.5 3.5" />
      <path d="M13 7h3l5 5-3 3M11 7H8L3 12l3 3" />
      <path d="M13.5 13.5 15 15M11.5 15.5 13 17" />
    </svg>
  );
}

export function IconHistory({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconChart({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12.5 16V7M17 16v-6" />
    </svg>
  );
}

export function IconGear({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M22 12h-3M5 12H2M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </svg>
  );
}

export function IconSnowflake({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2v20M2 12h20" />
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function IconBackspace({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M21 5H9L3 12l6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
      <path d="m17 9-5 6M12 9l5 6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
