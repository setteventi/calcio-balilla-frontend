"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sequentialColor } from "@/lib/chartColors";
import type { MatchTimelineEntry } from "@/lib/types";

const WEEKS_BACK = 26;
const CELL = 11;
const GAP = 2;
const STEP = CELL + GAP;

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfWeek(d: Date): Date {
  const day = (d.getDay() + 6) % 7; // lunedì = 0
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - day);
  return s;
}

const MONTHS_IT = [
  "gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic",
];

export function ActivityCalendar({ timeline }: { timeline: MatchTimelineEntry[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Su schermo stretto il calendario scrolla: parte dai giorni recenti, non da 26 settimane fa.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const { weeks, countByDate, maxCount } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of timeline) {
      const key = dateKey(new Date(entry.playedAt));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const today = new Date();
    const firstWeekStart = startOfWeek(today);
    firstWeekStart.setDate(firstWeekStart.getDate() - (WEEKS_BACK - 1) * 7);

    const weeksArr: Date[][] = [];
    for (let w = 0; w < WEEKS_BACK; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(firstWeekStart);
        day.setDate(day.getDate() + w * 7 + d);
        week.push(day);
      }
      weeksArr.push(week);
    }

    const max = Math.max(1, ...counts.values());
    return { weeks: weeksArr, countByDate: counts, maxCount: max };
  }, [timeline]);

  const selectedCount = selected ? countByDate.get(selected) ?? 0 : null;
  const selectedLabel = selected
    ? new Date(selected).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const width = weeks.length * STEP + 20;
  const height = 7 * STEP + 14;

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <h2 className="font-display text-2xl text-bone">Attività del gruppo</h2>
      <p className="font-mono text-[11px] text-bone-dim">Partite giocate, ultime {WEEKS_BACK} settimane</p>

      <p className="mt-2 min-h-[1.5rem] font-mono text-sm text-bone">
        {selected
          ? `${selectedLabel}: ${selectedCount} partit${selectedCount === 1 ? "a" : "e"}`
          : "Tocca un giorno per i dettagli"}
      </p>

      <div ref={scrollerRef} className="mt-2 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
          {weeks.map((week, wi) => {
            const first = week[0];
            const showMonthLabel = first.getDate() <= 7;
            return (
              <g key={wi}>
                {showMonthLabel && (
                  <text
                    x={wi * STEP + 20}
                    y={10}
                    className="font-mono"
                    fontSize={9}
                    fill="var(--bone-dim)"
                  >
                    {MONTHS_IT[first.getMonth()]}
                  </text>
                )}
                {week.map((day, di) => {
                  const key = dateKey(day);
                  const count = countByDate.get(key) ?? 0;
                  const isFuture = day.getTime() > Date.now();
                  const fill = isFuture
                    ? "transparent"
                    : count === 0
                      ? "var(--felt-800)"
                      : sequentialColor(count / maxCount);
                  return (
                    <rect
                      key={di}
                      x={wi * STEP + 20}
                      y={di * STEP + 14}
                      width={CELL}
                      height={CELL}
                      rx={2}
                      fill={fill}
                      opacity={count === 0 ? 0.5 : 1}
                      style={{ cursor: isFuture ? "default" : "pointer" }}
                      onClick={() => !isFuture && setSelected(key)}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5">
        <span className="font-mono text-[10px] text-bone-dim">meno</span>
        <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--felt-800)", opacity: 0.5 }} />
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <div key={t} className="h-2.5 w-2.5 rounded-sm" style={{ background: sequentialColor(t) }} />
        ))}
        <span className="font-mono text-[10px] text-bone-dim">più</span>
      </div>
    </div>
  );
}
