"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-led-red">
        Errore
      </p>
      <h1 className="font-display mt-2 text-h1 leading-[0.95] text-bone">
        Il tabellone si è <span className="text-amber">spento</span>
      </h1>
      <p className="font-mono mt-3 text-body leading-relaxed text-bone-dim">
        Il server non ha risposto come previsto. Spesso basta riprovare: se hai
        appena aperto l&apos;app dopo un po&apos; di inattività, il primo
        caricamento può metterci qualche secondo.
      </p>

      <button
        onClick={reset}
        className="font-mono mt-6 rounded-full bg-amber px-6 py-2.5 text-caption font-bold uppercase tracking-[0.18em] text-felt-950 transition-transform duration-[var(--dur-instant)] active:scale-[0.97]"
      >
        Riprova
      </button>
    </main>
  );
}
