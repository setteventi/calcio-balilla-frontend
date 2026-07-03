import Link from "next/link";
import { serverFetch } from "@/lib/api.server";
import type { PlayerStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function ClassificaPage() {
  const stats = await serverFetch<PlayerStats[]>("/stats/players");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Classifica
        </p>
        <h1 className="font-display text-4xl text-bone">
          Rating <span className="text-amber">ELO</span>
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-2 px-5 pb-6 pt-5">
        {stats.map((s, i) => (
          <Link
            key={s.playerId}
            href={`/giocatore/${s.playerId}`}
            className="flex items-center gap-3 rounded-xl border border-felt-line bg-felt-panel px-3 py-3 transition-colors hover:border-amber"
          >
            <span className="font-display w-7 text-2xl text-bone-dim">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl text-bone">{s.name}</span>
                <span className="scoreboard-digit text-xl text-amber">{s.elo}</span>
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-bone-dim">
                <span>
                  {s.matchesPlayed} partite · {pct(s.winRate)} vittorie
                </span>
                <span>peso {pct(s.weightShare)}</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-felt-950">
                <div
                  className="h-full bg-cyan"
                  style={{ width: `${Math.max(4, s.weightShare * 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}

        {stats.length === 0 && (
          <p className="font-mono text-sm text-bone-dim">
            Nessuna statistica disponibile ancora — registra qualche partita.
          </p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
