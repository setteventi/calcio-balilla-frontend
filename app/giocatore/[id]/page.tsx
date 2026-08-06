import Link from "next/link";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api.server";
import type { HeadToHeadStats, PairStats, PlayerStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { Caption, SectionRule } from "@/components/ui/Text";
import { IconArrowLeft } from "@/components/icons";

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
    <PageShell>
      {/* La posizione in classifica è il dato identitario della schermata:
          diventa una cifra grande accanto al nome, non un'etichetta grigia. */}
      <header className="relative px-5 pt-8">
        <Link
          href="/classifica"
          className="font-mono inline-flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.18em] text-bone-dim transition-colors duration-[var(--dur-fast)] hover:text-amber"
        >
          <IconArrowLeft className="size-3.5" />
          Classifica
        </Link>
        <div className="mt-2 flex items-end gap-3">
          <span
            aria-hidden
            className={`font-display text-podio leading-[0.8] ${
              rank === 1 ? "text-amber" : "text-chrome opacity-60"
            }`}
          >
            {rank}
          </span>
          <h1 className="font-display min-w-0 flex-1 break-words text-h1 leading-[0.95] tracking-[-0.01em] text-bone">
            {player.name}
          </h1>
        </div>
        <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
      </header>

      <PageBody className="space-y-6">
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
          <SectionRule label="Migliori compagni" />
          <div className="mt-3 space-y-2">
            {pairs.map((p, i) => (
              <div
                key={p.partnerName}
                className="snap-rank surface flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
              >
                <span className="font-display truncate text-lead text-bone">
                  {p.partnerName}
                </span>
                <div className="shrink-0 text-right">
                  <span className="font-mono block text-body font-bold tabular-nums text-amber">
                    {pct(p.winRateTogether)}
                  </span>
                  <Caption>{p.matchesTogether} partite</Caption>
                </div>
              </div>
            ))}
            {pairs.length === 0 && (
              <Caption>
                Non ci sono ancora abbastanza partite con nessun compagno.
              </Caption>
            )}
          </div>
        </section>

        <section>
          <SectionRule label="Avversari frequenti" />
          <div className="mt-3 space-y-2">
            {h2h.map((h, i) => (
              <div
                key={h.opponentName}
                className="snap-rank surface flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
              >
                <span className="font-display truncate text-lead text-bone">
                  {h.opponentName}
                </span>
                <div className="shrink-0 text-right">
                  <span className="font-mono block text-body font-bold tabular-nums text-cyan">
                    {pct(h.winRate)}
                  </span>
                  <Caption>{h.matches} scontri</Caption>
                </div>
              </div>
            ))}
            {h2h.length === 0 && (
              <Caption>Nessun avversario ricorrente ancora significativo.</Caption>
            )}
          </div>
        </section>
      </PageBody>

      <BottomNav />
    </PageShell>
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
    <div className="surface rounded-xl px-3 py-3 text-center">
      <span
        className={`scoreboard-digit block text-2xl ${accent === "cyan" ? "text-cyan" : "text-amber"}`}
      >
        {value}
      </span>
      <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
        {label}
      </span>
      {sub && <Caption className="mt-0.5">{sub}</Caption>}
    </div>
  );
}
