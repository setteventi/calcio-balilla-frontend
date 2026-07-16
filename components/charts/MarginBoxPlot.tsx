"use client";

import { useMemo } from "react";
import type { MatchTimelineEntry } from "@/lib/types";

const MIN_SAMPLE = 5;
const W = 360;
const H = 130;
const MARGIN = { top: 10, right: 16, bottom: 24, left: 16 };
const PLOT_W = W - MARGIN.left - MARGIN.right;
const BOX_Y = 55;
const BOX_H = 26;

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function MarginBoxPlot({ timeline }: { timeline: MatchTimelineEntry[] }) {
  const margins = useMemo(
    () =>
      timeline
        .filter((m) => m.scoreA !== null && m.scoreB !== null)
        .map((m) => Math.abs((m.scoreA as number) - (m.scoreB as number))),
    [timeline]
  );

  const belowThreshold = margins.length < MIN_SAMPLE;

  const stats = useMemo(() => {
    if (margins.length === 0) return null;
    const sorted = [...margins].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const median = quantile(sorted, 0.5);
    const q3 = quantile(sorted, 0.75);
    const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    return { sorted, min: sorted[0], q1, median, q3, max: sorted[sorted.length - 1], mean };
  }, [margins]);

  if (!stats) {
    return (
      <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
        <h2 className="font-display text-2xl text-bone">Scarti punti</h2>
        <p className="mt-3 font-mono text-sm text-bone-dim">
          Nessuna partita con punteggio esatto registrato ancora.
        </p>
      </div>
    );
  }

  const maxAxis = Math.max(1, Math.ceil(stats.max / 2) * 2);
  const xScale = (v: number) => MARGIN.left + (v / maxAxis) * PLOT_W;
  const xTicks = Array.from({ length: 5 }, (_, i) => Math.round((maxAxis / 4) * i));

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <h2 className="font-display text-2xl text-bone">Scarti punti</h2>
      <p className="font-mono text-[11px] text-bone-dim">
        Distribuzione dello scarto tra i due punteggi (solo partite con punteggio esatto)
      </p>
      {belowThreshold && (
        <p className="mt-1 font-mono text-[11px] text-chart-cat-4">
          Campione ridotto ({margins.length} partit{margins.length === 1 ? "a" : "e"}) — dati indicativi
        </p>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full">
        {xTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={MARGIN.top}
              y2={H - MARGIN.bottom}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text
              x={xScale(tick)}
              y={H - MARGIN.bottom + 14}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              fill="var(--bone-dim)"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* baffi min-max */}
        <line
          x1={xScale(stats.min)}
          x2={xScale(stats.max)}
          y1={BOX_Y + BOX_H / 2}
          y2={BOX_Y + BOX_H / 2}
          stroke="var(--chart-cat-1)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={xScale(stats.min)}
          x2={xScale(stats.min)}
          y1={BOX_Y + 4}
          y2={BOX_Y + BOX_H - 4}
          stroke="var(--chart-cat-1)"
          strokeWidth={2}
        />
        <line
          x1={xScale(stats.max)}
          x2={xScale(stats.max)}
          y1={BOX_Y + 4}
          y2={BOX_Y + BOX_H - 4}
          stroke="var(--chart-cat-1)"
          strokeWidth={2}
        />

        {/* box IQR */}
        <rect
          x={xScale(stats.q1)}
          y={BOX_Y}
          width={Math.max(1, xScale(stats.q3) - xScale(stats.q1))}
          height={BOX_H}
          fill="var(--chart-cat-1)"
          fillOpacity={0.18}
          stroke="var(--chart-cat-1)"
          strokeWidth={2}
        />
        {/* mediana */}
        <line
          x1={xScale(stats.median)}
          x2={xScale(stats.median)}
          y1={BOX_Y}
          y2={BOX_Y + BOX_H}
          stroke="var(--bone)"
          strokeWidth={2}
        />

        {/* singole partite, leggero jitter verticale deterministico */}
        {stats.sorted.map((v, i) => {
          const jitter = ((i % 5) - 2) * 4;
          return (
            <circle
              key={i}
              cx={xScale(v)}
              cy={BOX_Y + BOX_H + 16 + jitter}
              r={2.5}
              fill="var(--chart-cat-2)"
              fillOpacity={0.7}
            />
          );
        })}
      </svg>

      <p className="mt-1 font-mono text-[11px] text-bone-dim">
        Mediana {Math.round(stats.median)} · Media {stats.mean.toFixed(1)} · N={margins.length}
      </p>
    </div>
  );
}
