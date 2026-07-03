import { serverFetch } from "@/lib/api.server";
import type { PairStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function CoppiePage() {
  const pairs = await serverFetch<PairStats[]>("/stats/pairs");
  const ranked = pairs.filter((p) => !p.belowThreshold);
  const emerging = pairs.filter((p) => p.belowThreshold).sort((a, b) => b.matchesTogether - a.matchesTogether);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Sinergie
        </p>
        <h1 className="font-display text-4xl text-bone">
          Chi gioca <span className="text-amber">meglio</span> con chi
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-6 pt-5">
        <section>
          <h2 className="font-display text-xl text-bone-dim">Coppie affidabili</h2>
          <p className="font-mono text-[11px] text-bone-dim">
            Almeno 3 partite insieme
          </p>
          <div className="mt-3 space-y-2">
            {ranked.map((p) => (
              <PairRow key={`${p.playerAId}-${p.playerBId}`} pair={p} />
            ))}
            {ranked.length === 0 && (
              <p className="font-mono text-sm text-bone-dim">
                Ancora nessuna coppia con dati sufficienti.
              </p>
            )}
          </div>
        </section>

        {emerging.length > 0 && (
          <section>
            <h2 className="font-display text-xl text-bone-dim">Campione ridotto</h2>
            <p className="font-mono text-[11px] text-bone-dim">
              Meno di 3 partite insieme — dati non ancora significativi
            </p>
            <div className="mt-3 space-y-2 opacity-60">
              {emerging.map((p) => (
                <PairRow key={`${p.playerAId}-${p.playerBId}`} pair={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function PairRow({ pair }: { pair: PairStats }) {
  const synergyPositive = (pair.synergyScore ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-felt-line bg-felt-panel px-3 py-2.5">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg text-bone">
          {pair.playerAName} + {pair.playerBName}
        </span>
        {pair.synergyScore !== null && (
          <span
            className={`scoreboard-digit text-sm ${
              synergyPositive ? "text-amber" : "text-led-red"
            }`}
          >
            {synergyPositive ? "+" : ""}
            {Math.round(pair.synergyScore * 100)}
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] text-bone-dim">
        {pair.matchesTogether} partite insieme · {pct(pair.winRateTogether)} vittorie
      </span>
    </div>
  );
}
