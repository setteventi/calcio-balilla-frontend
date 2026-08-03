import type { DaysAtTopEntry, FreezePeriod } from "@/lib/types";
import { FreezeManager } from "@/components/FreezeManager";

// Confronto di magnitudo su una sola metrica (giorni da n.1): barre orizzontali
// ordinate. Il n.1 attuale è pieno + corona; gli altri smorzati. Nessuna seconda
// tinta: una metrica sola = un colore solo.
export function DaysAtTopChart({
  entries,
  freezePeriods,
}: {
  entries: DaysAtTopEntry[];
  freezePeriods: FreezePeriod[];
}) {
  const withDays = entries.filter((e) => e.days > 0);
  const maxDays = Math.max(1, ...withDays.map((e) => e.days));

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <h2 className="font-display text-2xl text-bone">Giorni da n.1</h2>
      <p className="font-mono text-[11px] text-bone-dim">
        Giorni totali passati in testa alla classifica ELO — cresce ogni giorno che resti primo
      </p>

      {withDays.length === 0 ? (
        <p className="mt-3 font-mono text-sm text-bone-dim">
          Ancora nessun n.1 stabile: servono più partite.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {withDays.map((e, i) => {
            const widthPct = Math.max(6, (e.days / maxDays) * 100);
            return (
              <div key={e.playerId} className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-right font-mono text-[11px] text-bone-dim">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-display text-lg text-bone">
                      {e.name} {e.isCurrent && "👑"}
                    </span>
                    <span className="scoreboard-digit shrink-0 text-sm text-amber">
                      {e.days} {e.days === 1 ? "giorno" : "giorni"}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-felt-950">
                    <div
                      className="h-full rounded-full bg-amber transition-all"
                      style={{ width: `${widthPct}%`, opacity: e.isCurrent ? 1 : 0.5 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FreezeManager periods={freezePeriods} />
    </div>
  );
}
