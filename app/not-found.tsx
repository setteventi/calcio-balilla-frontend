import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
        Pagina non trovata
      </p>
      <h1 className="font-display mt-2 text-h1 leading-[0.95] text-bone">
        Palla <span className="text-amber">fuori</span>
      </h1>
      <p className="font-mono mt-3 text-body leading-relaxed text-bone-dim">
        Questo indirizzo non esiste, o la partita che cercavi è stata eliminata.
      </p>
      <Link
        href="/"
        className="font-mono mt-6 rounded-full bg-amber px-6 py-2.5 text-caption font-bold uppercase tracking-[0.18em] text-felt-950 transition-transform duration-[var(--dur-instant)] active:scale-[0.97]"
      >
        Torna al tabellone
      </Link>
    </main>
  );
}
