import Link from "next/link";
import { serverFetch } from "@/lib/api.server";
import type { MatchListItem, PlayerPublic, PlayerStats } from "@/lib/types";
import { MatchForm } from "@/components/MatchForm";
import { BottomNav } from "@/components/BottomNav";
import { MatchRow } from "@/components/MatchRow";
import { PageBody, PageShell } from "@/components/ui/Page";
import { Caption, Eyebrow, SectionRule } from "@/components/ui/Text";
import { IconCrown, IconGear } from "@/components/icons";

export default async function DashboardPage() {
  const me = await serverFetch<{ id: string; name: string }>("/auth/me");
  const [players, matches, stats] = await Promise.all([
    serverFetch<PlayerPublic[]>("/auth/players"),
    serverFetch<MatchListItem[]>("/matches?limit=6"),
    serverFetch<PlayerStats[]>("/stats/players"),
  ]);

  const leader = stats[0];
  const mine = stats.find((s) => s.playerId === me.id);
  const myRank = stats.findIndex((s) => s.playerId === me.id) + 1;

  return (
    <PageShell>
      {/* Testata: il nome dell'app è l'insegna, non un h1 ripetuto come altrove.
          La striscia di stato sotto dà un motivo per aprire l'app anche senza
          registrare nulla — prima qui non c'era alcun dato. */}
      <header className="relative overflow-hidden px-5 pt-8">
        <div className="flex items-baseline justify-between gap-3">
          <Eyebrow>Ciao {me.name}</Eyebrow>
          <Link
            href="/profilo"
            className="flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim transition-colors duration-[var(--dur-fast)] hover:text-amber"
          >
            Profilo
            <IconGear className="size-3.5" />
          </Link>
        </div>

        <h1 className="font-display text-h1 leading-[0.95] tracking-[-0.01em] text-bone">
          Calcio<span className="text-amber">Balilla</span>
        </h1>

        <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
      </header>

      <PageBody className="space-y-6">
        {/* Striscia di stato: chi comanda + dove sto io. Due dati, letti in un
            colpo d'occhio, senza aprire la classifica. */}
        {leader && (
          <div className="grid grid-cols-[1.2fr_1fr] gap-3">
            <Link
              href="/classifica"
              className="snap-rank surface-raised group relative overflow-hidden rounded-2xl px-4 py-3 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-soft)] active:scale-[0.99]"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="flex items-center gap-1.5 text-amber">
                <IconCrown className="size-3.5" />
                <span className="font-mono text-eyebrow uppercase tracking-[0.18em]">
                  In testa
                </span>
              </div>
              <p className="font-display mt-1 truncate text-lead leading-tight text-bone">
                {leader.name}
              </p>
              <p className="scoreboard-digit text-xl leading-none text-amber">
                {leader.elo}
              </p>
            </Link>

            <Link
              href={mine ? `/giocatore/${mine.playerId}` : "/classifica"}
              className="snap-rank surface relative overflow-hidden rounded-2xl px-4 py-3 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-soft)] active:scale-[0.99]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <Eyebrow>Tu</Eyebrow>
              {mine ? (
                <>
                  <p className="font-display mt-1 text-lead leading-tight text-bone">
                    {myRank}º posto
                  </p>
                  <p className="font-mono text-xl font-bold leading-none tabular-nums text-cyan">
                    {mine.elo}
                  </p>
                </>
              ) : (
                <p className="font-mono mt-1 text-caption leading-snug text-bone-dim">
                  Gioca la prima partita
                </p>
              )}
            </Link>
          </div>
        )}

        <MatchForm players={players} />

        <section>
          <SectionRule label="Ultime partite" />
          <div className="mt-3 space-y-2">
            {matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-felt-700 px-6 py-10 text-center">
                <p className="font-display text-lead text-bone">
                  Nessuna partita registrata
                </p>
                <Caption className="mt-1">
                  Compila il tabellone qui sopra: la classifica si costruisce da sé.
                </Caption>
              </div>
            ) : (
              matches.map((m, i) => (
                <div
                  key={m.id}
                  className="snap-rank"
                  style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                >
                  <MatchRow match={m} />
                </div>
              ))
            )}
          </div>
        </section>
      </PageBody>

      <BottomNav />
    </PageShell>
  );
}
