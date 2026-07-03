import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api.server";
import type { HeadToHeadStats, PairStats, PlayerStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function GiocatorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [allStats, allPairs, allH2h] = await Promise.all([
    serverFetch<PlayerStats[]>("/stats/players"),
    serverFetch<PairStats[]>("/stats/pairs"),
    serverFetch<HeadToHeadStats[]>("/stats/head-to-head"),
  ]);

  const player = allStats.find((s) => s.playerId === id);
  if (!player) notFound();

  const rank = allStats.findIndex((s) => s.playerId === id) + 1;

  const pairs = allPairs
    .filter((p) => (p.playerAId === id || p.playerBId === id) && !p.belowThreshold)
    .map((p) => ({
      partnerName: p.playerAId === id ? p.playerBName : p.playerAName,
      ...p,
    }))
    .sort((a, b) => (b.synergyScore ?? 0) - (a.synergyScore ?? 0));

  const h2h = allH2h
    .filter((h) => (h.playerAId === id || h.playerBId === id) && !h.belowThreshold)
    .map((h) => {
      const isA = h.playerAId === id;
      return {
        opponentName: isA ? h.playerBName : h.playerAName,
        matches: h.matchesAgainst,
        winRate: isA ? h.aWinRateAgainstB : 1 - h.aWinRateAgainstB,
      };
    })
    .sort((a, b) => b.matches - a.matches);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          #{rank} in classifica
        </p>
        <h1 className="font-display text-4xl text-bone">{player.name}</h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-6 pt-5">
        <section className="grid grid-cols-3 gap-2">
          <StatCard label="ELO" value={player.elo.toString()} />
          <StatCard label="Partite" value={player.matchesPlayed.toString()} />
          <StatCard label="Vittorie" value={pct(player.winRate)} />
        </section>

        <section className="grid grid-cols-2 gap-2">
          <StatCard
            label="Rendimento attacco"
            value={player.attackWinRate !== null ? pct(player.attackWinRate) : "—"}
            sub={`${player.attackMatches} partite`}
          />
          <StatCard
            label="Rendimento difesa"
            value={player.defenseWinRate !== null ? pct(player.defenseWinRate) : "—"}
            sub={`${player.defenseMatches} partite`}
            accent="cyan"
          />
        </section>

        <section>
          <h2 className="font-display text-xl text-bone-dim">Migliori compagni</h2>
          <div className="mt-3 space-y-2">
            {pairs.map((p) => (
              <div
                key={p.partnerName}
                className="flex items-center justify-between rounded-xl border border-felt-line bg-felt-panel px-3 py-2.5"
              >
                <span className="font-display text-lg text-bone">{p.partnerName}</span>
                <div className="text-right">
                  <span className="scoreboard-digit block text-sm text-amber">
                    {pct(p.winRateTogether)}
                  </span>
                  <span className="font-mono text-[10px] text-bone-dim">
                    {p.matchesTogether} partite
                  </span>
                </div>
              </div>
            ))}
            {pairs.length === 0 && (
              <p className="font-mono text-sm text-bone-dim">
                Non ci sono ancora abbastanza partite con nessun compagno.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-bone-dim">Avversari frequenti</h2>
          <div className="mt-3 space-y-2">
            {h2h.map((h) => (
              <div
                key={h.opponentName}
                className="flex items-center justify-between rounded-xl border border-felt-line bg-felt-panel px-3 py-2.5"
              >
                <span className="font-display text-lg text-bone">{h.opponentName}</span>
                <div className="text-right">
                  <span className="scoreboard-digit block text-sm text-amber">
                    {pct(h.winRate)}
                  </span>
                  <span className="font-mono text-[10px] text-bone-dim">
                    {h.matches} scontri
                  </span>
                </div>
              </div>
            ))}
            {h2h.length === 0 && (
              <p className="font-mono text-sm text-bone-dim">
                Nessun avversario ricorrente ancora significativo.
              </p>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = "amber",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "amber" | "cyan";
}) {
  return (
    <div className="rounded-xl border border-felt-line bg-felt-panel px-3 py-3 text-center">
      <span
        className={`scoreboard-digit block text-2xl ${accent === "cyan" ? "text-cyan" : "text-amber"}`}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">
        {label}
      </span>
      {sub && <span className="mt-0.5 block font-mono text-[10px] text-bone-dim">{sub}</span>}
    </div>
  );
}
