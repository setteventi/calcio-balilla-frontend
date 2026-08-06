import type { ReactNode } from "react";

/** Etichetta piccola maiuscola spaziata. Era `font-mono text-[11px] …` × 11. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim ${className}`}
    >
      {children}
    </p>
  );
}

/** Riga di dettaglio sotto un titolo. Era `font-mono text-[10px|11px] …` × 18. */
export function Caption({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-caption text-bone-dim ${className}`}>
      {children}
    </p>
  );
}

/** Titolo di sezione dentro una pagina. Era `font-display text-2xl …` × 9. */
export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`font-display text-h2 leading-tight text-bone ${className}`}>
      {children}
    </h2>
  );
}

/**
 * Separatore con etichetta: l'asta cromata che taglia la pagina fra due blocchi.
 * Introdotto sulla classifica come "Inseguitori", riusato dove serve un cambio
 * di ritmo dentro una lista lunga.
 */
export function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
        {label}
      </span>
      <div className="rod-divider flex-1" />
    </div>
  );
}
