import { serverFetch } from "@/lib/api.server";
import type { MatchListItem } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { MatchRow } from "@/components/MatchRow";
import { PageBody, PageHeader, PageShell } from "@/components/ui/Page";
import { Caption } from "@/components/ui/Text";
import { IconHistory } from "@/components/icons";

/** Etichetta di giornata: "oggi" / "ieri" / data estesa. */
function dayLabel(ymd: string): string {
  const today = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString("en-CA");
  if (ymd === today) return "Oggi";
  if (ymd === yesterday) return "Ieri";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export default async function StoricoPage() {
  const matches = await serverFetch<MatchListItem[]>("/matches?limit=200");

  // Raggruppare per giornata dà alla lista un ritmo: prima era una colonna
  // uniforme di 200 rettangoli identici.
  const byDay = new Map<string, MatchListItem[]>();
  for (const m of matches) {
    const key = new Date(m.played_at).toLocaleDateString("en-CA");
    const list = byDay.get(key);
    if (list) list.push(m);
    else byDay.set(key, [m]);
  }
  const days = [...byDay.entries()];

  return (
    <PageShell>
      <PageHeader eyebrow="Storico" title="Tutte le" accent="partite" />

      <PageBody className="space-y-6">
        {days.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-felt-700 px-6 py-12 text-center">
            <IconHistory className="mx-auto size-8 text-bone-dim opacity-50" />
            <p className="font-display mt-3 text-lead text-bone">
              Nessuna partita registrata
            </p>
            <Caption className="mt-1">
              Le partite che registri finiscono qui, in ordine di giornata.
            </Caption>
          </div>
        ) : (
          days.map(([ymd, dayMatches], dayIdx) => (
            <section key={ymd}>
              {/* Intestazione di giornata appiccicata in alto: scorrendo una
                  lista lunga si sa sempre di che giorno si sta leggendo. */}
              <div className="sticky top-0 z-[var(--z-sticky)] -mx-5 flex items-center gap-3 bg-felt/85 px-5 py-2 backdrop-blur">
                <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
                  {dayLabel(ymd)}
                </span>
                <div className="rod-divider flex-1" />
                <span className="font-mono text-eyebrow tabular-nums text-bone-dim">
                  {dayMatches.length}
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {dayMatches.map((m, i) => (
                  <div
                    key={m.id}
                    className="snap-rank"
                    style={
                      {
                        "--i": dayIdx === 0 ? Math.min(i, 7) : 0,
                      } as React.CSSProperties
                    }
                  >
                    <MatchRow match={m} showDay={false} />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </PageBody>

      <BottomNav />
    </PageShell>
  );
}
