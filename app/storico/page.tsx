import { serverFetch } from "@/lib/api.server";
import type { MatchListItem } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { MatchRow } from "@/components/MatchRow";

export default async function StoricoPage() {
  const matches = await serverFetch<MatchListItem[]>("/matches?limit=200");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Storico
        </p>
        <h1 className="font-display text-4xl text-bone">
          Tutte le <span className="text-amber">partite</span>
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-2 px-5 pb-6 pt-5">
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
        {matches.length === 0 && (
          <p className="font-mono text-sm text-bone-dim">
            Nessuna partita registrata ancora.
          </p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
