import { serverFetch } from "@/lib/api.server";
import type { PairStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageHeader, PageShell } from "@/components/ui/Page";
import { Caption, SectionRule } from "@/components/ui/Text";
import { IconHandshake } from "@/components/icons";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function CoppiePage() {
  const pairs = await serverFetch<PairStats[]>("/stats/pairs");
  const ranked = pairs.filter((p) => !p.belowThreshold);
  const emerging = pairs
    .filter((p) => p.belowThreshold)
    .sort((a, b) => b.matchesTogether - a.matchesTogether);

  const best = ranked[0];
  const rest = ranked.slice(1);

  return (
    <PageShell>
      <PageHeader eyebrow="Sinergie" title="Chi gioca con" accent="chi" />

      <PageBody className="space-y-6">
        {ranked.length === 0 && emerging.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-felt-700 px-6 py-12 text-center">
            <IconHandshake className="mx-auto size-8 text-bone-dim opacity-50" />
            <p className="font-display mt-3 text-lead text-bone">
              Ancora nessuna coppia
            </p>
            <Caption className="mt-1">
              Servono almeno 3 partite insieme perché una coppia conti.
            </Caption>
          </div>
        ) : (
          <>
            {/* La coppia migliore prende il trattamento da protagonista: è il
                dato che il gruppo commenta davvero. */}
            {best && (
              <div
                className="snap-rank surface-raised relative overflow-hidden rounded-2xl px-5 pb-4 pt-5"
                style={{ "--i": 0 } as React.CSSProperties}
              >
                <IconHandshake
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-4 size-32 text-cyan opacity-[0.06]"
                />
                <div className="relative flex items-center gap-2 text-cyan">
                  <IconHandshake className="size-4" />
                  <span className="font-mono text-eyebrow font-bold uppercase tracking-[0.18em]">
                    Miglior intesa
                  </span>
                </div>
                <div className="relative mt-2 flex items-end justify-between gap-3">
                  <h2 className="font-display min-w-0 text-h2 leading-none text-bone">
                    {best.playerAName} + {best.playerBName}
                  </h2>
                  {best.synergyScore !== null && (
                    <span className="scoreboard-digit shrink-0 text-2xl leading-none text-cyan">
                      {best.synergyScore >= 0 ? "+" : ""}
                      {Math.round(best.synergyScore * 100)}
                    </span>
                  )}
                </div>
                <Caption className="relative mt-3">
                  {best.matchesTogether} partite insieme ·{" "}
                  {pct(best.winRateTogether)} vittorie
                </Caption>
              </div>
            )}

            {rest.length > 0 && (
              <section>
                <SectionRule label="Altre coppie affidabili" />
                <ul className="mt-3 space-y-2">
                  {rest.map((p, i) => (
                    <li
                      key={`${p.playerAId}-${p.playerBId}`}
                      className="snap-rank"
                      style={{ "--i": Math.min(i + 1, 7) } as React.CSSProperties}
                    >
                      <PairRow pair={p} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {emerging.length > 0 && (
              <section>
                <SectionRule label="Campione ridotto" />
                <Caption className="mt-2">
                  Meno di 3 partite insieme: numeri non ancora significativi.
                </Caption>
                <ul className="mt-3 space-y-2 opacity-55">
                  {emerging.map((p) => (
                    <li key={`${p.playerAId}-${p.playerBId}`}>
                      <PairRow pair={p} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </PageBody>

      <BottomNav />
    </PageShell>
  );
}

function PairRow({ pair }: { pair: PairStats }) {
  const positive = (pair.synergyScore ?? 0) >= 0;
  return (
    <div className="surface rounded-xl px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display truncate text-lead text-bone">
          {pair.playerAName} + {pair.playerBName}
        </span>
        {pair.synergyScore !== null && (
          <span
            className={`font-mono shrink-0 text-body font-bold tabular-nums ${
              positive ? "text-cyan" : "text-led-red"
            }`}
          >
            {positive ? "+" : ""}
            {Math.round(pair.synergyScore * 100)}
          </span>
        )}
      </div>
      <Caption className="mt-0.5">
        {pair.matchesTogether} partite insieme · {pct(pair.winRateTogether)} vittorie
      </Caption>
    </div>
  );
}
