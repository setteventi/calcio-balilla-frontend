import type { ReactNode } from "react";

/**
 * Guscio di pagina: era `flex min-h-screen flex-col` ripetuto su 9 file.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}

/**
 * Testata comune: occhiello, titolo, asta cromata.
 * L'asta esce dal padding a tutta larghezza — è la stessa crepa nel contenitore
 * introdotta sulla classifica, così il ritmo resta coerente fra le schermate.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  action,
}: {
  eyebrow: string;
  /** Parte del titolo in colore normale. */
  title: ReactNode;
  /** Parola evidenziata in verde, opzionale. */
  accent?: ReactNode;
  /** Elemento a destra dell'occhiello (es. link al profilo). */
  action?: ReactNode;
}) {
  return (
    <header className="relative px-5 pt-8">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
          {eyebrow}
        </p>
        {action}
      </div>
      <h1 className="font-display text-h1 leading-[0.95] tracking-[-0.01em] text-bone">
        {title}
        {accent && <span className="text-amber"> {accent}</span>}
      </h1>
      <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
    </header>
  );
}

/** Corpo pagina a colonna centrata. */
export function PageBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`mx-auto w-full max-w-md flex-1 px-5 pb-6 pt-5 ${className}`}>
      {children}
    </main>
  );
}
