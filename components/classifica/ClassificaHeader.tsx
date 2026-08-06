/** L'asta cromata esce dal contenitore a tutta larghezza: prima crepa nel
 *  `max-w-md` ripetuto su ogni schermata. */
export function ClassificaHeader() {
  return (
    <header className="relative px-5 pt-8">
      <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
        Classifica
      </p>
      <h1 className="font-display text-h1 leading-[0.95] tracking-[-0.01em] text-bone">
        Rating <span className="text-amber">ELO</span>
      </h1>
      <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
    </header>
  );
}
