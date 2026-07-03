import Link from "next/link";
import { serverFetch } from "@/lib/api.server";
import type { MatchListItem, PlayerPublic } from "@/lib/types";
import { MatchForm } from "@/components/MatchForm";
import { BottomNav } from "@/components/BottomNav";
import { MatchRow } from "@/components/MatchRow";

export default async function DashboardPage() {
  const me = await serverFetch<{ id: string; name: string }>("/auth/me");
  const [players, matches] = await Promise.all([
    serverFetch<PlayerPublic[]>("/auth/players"),
    serverFetch<MatchListItem[]>("/matches?limit=8"),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
            Ciao {me.name}
          </p>
          <Link
            href="/profilo"
            className="font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-amber"
          >
            Profilo ⚙
          </Link>
        </div>
        <h1 className="font-display text-4xl text-bone">
          Calcio<span className="text-amber">Balilla</span>
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-6 pt-5">
        <MatchForm players={players} />

        <section>
          <h2 className="font-display text-xl text-bone-dim">Ultime partite</h2>
          <div className="mt-3 space-y-2">
            {matches.length === 0 && (
              <p className="font-mono text-sm text-bone-dim">
                Nessuna partita registrata ancora.
              </p>
            )}
            {matches.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
