"use client";

import { useMemo, useRef, useState } from "react";
import { categoricalColor, CATEGORICAL } from "@/lib/chartColors";
import type { MatchTimelineEntry, PlayerStats } from "@/lib/types";

const ELO_START = 1000;
const MAX_SERIES = CATEGORICAL.length;

const W = 400;
const H = 220;
const MARGIN = { top: 12, right: 12, bottom: 22, left: 34 };
const PLOT_W = W - MARGIN.left - MARGIN.right;
const PLOT_H = H - MARGIN.top - MARGIN.bottom;

function niceStep(range: number) {
  const raw = range / 4;
  const pow = 10 ** Math.floor(Math.log10(raw || 1));
  const candidates = [1, 2, 5, 10].map((m) => m * pow);
  return candidates.find((c) => c >= raw) ?? candidates[candidates.length - 1];
}

function defaultSelection(players: PlayerStats[], currentPlayerId?: string): string[] {
  const top = players.slice(0, Math.min(5, MAX_SERIES)).map((p) => p.playerId);
  if (currentPlayerId && !top.includes(currentPlayerId) && top.length < MAX_SERIES) {
    return [...top, currentPlayerId];
  }
  if (currentPlayerId && !top.includes(currentPlayerId) && top.length >= MAX_SERIES) {
    return [...top.slice(0, MAX_SERIES - 1), currentPlayerId];
  }
  return top;
}

export function EloHistoryChart({
  players,
  timeline,
  currentPlayerId,
}: {
  players: PlayerStats[];
  timeline: MatchTimelineEntry[];
  currentPlayerId?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string[]>(() => defaultSelection(players, currentPlayerId));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const nameById = useMemo(() => new Map(players.map((p) => [p.playerId, p.name])), [players]);

  const points = useMemo(() => {
    // x=0 è il rating di partenza (1000) prima di qualunque partita
    const n = timeline.length;
    const series = new Map<string, number[]>();
    for (const id of selected) {
      const values = [ELO_START];
      let last = ELO_START;
      for (const entry of timeline) {
        const v = entry.eloAfter[id];
        last = typeof v === "number" ? v : last;
        values.push(last);
      }
      series.set(id, values);
    }
    return { n, series };
  }, [timeline, selected]);

  const { yMin, yMax } = useMemo(() => {
    let min = ELO_START;
    let max = ELO_START;
    for (const values of points.series.values()) {
      for (const v of values) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    const step = niceStep(max - min || 100);
    return {
      yMin: Math.floor((min - step * 0.5) / step) * step,
      yMax: Math.ceil((max + step * 0.5) / step) * step,
    };
  }, [points]);

  const xScale = (i: number) => MARGIN.left + (points.n > 0 ? (i / points.n) * PLOT_W : 0);
  const yScale = (v: number) => MARGIN.top + (1 - (v - yMin) / (yMax - yMin || 1)) * PLOT_H;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_SERIES) return prev;
      return [...prev, id];
    });
  }

  function handlePointer(clientX: number) {
    const svg = svgRef.current;
    if (!svg || points.n === 0) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * W;
    const i = Math.round(((relX - MARGIN.left) / PLOT_W) * points.n);
    setHoverIndex(Math.max(0, Math.min(points.n, i)));
  }

  const yTicks = useMemo(() => {
    const step = niceStep(yMax - yMin);
    const ticks: number[] = [];
    for (let v = yMin; v <= yMax + 0.001; v += step) ticks.push(Math.round(v));
    return ticks;
  }, [yMin, yMax]);

  const activeIndex = hoverIndex ?? points.n;
  const activeDate =
    activeIndex > 0 && timeline[activeIndex - 1]
      ? new Date(timeline[activeIndex - 1].playedAt).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Inizio";

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-bone">Storico ELO</h2>
        <span className="font-mono text-[11px] text-bone-dim">{activeDate}</span>
      </div>

      {points.n === 0 ? (
        <p className="mt-3 font-mono text-sm text-bone-dim">
          Nessuna partita registrata ancora.
        </p>
      ) : (
        <>
          {/* Readout: valori della serie al punto attivo (crosshair), sempre visibile */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {selected.map((id, idx) => {
              const values = points.series.get(id);
              const v = values?.[Math.min(activeIndex, (values?.length ?? 1) - 1)];
              return (
                <div key={id} className="flex items-center gap-1.5">
                  <span
                    className="h-0.5 w-4 rounded-full"
                    style={{ backgroundColor: categoricalColor(idx) }}
                  />
                  <span className="font-mono text-[11px] text-bone-dim">{nameById.get(id)}</span>
                  <span className="scoreboard-digit text-sm text-bone">{v ?? "—"}</span>
                </div>
              );
            })}
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="mt-2 w-full touch-none"
            onPointerMove={(e) => handlePointer(e.clientX)}
            onPointerDown={(e) => handlePointer(e.clientX)}
            onPointerLeave={() => setHoverIndex(null)}
          >
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={W - MARGIN.right}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="var(--chart-grid)"
                  strokeWidth={1}
                />
                <text
                  x={MARGIN.left - 6}
                  y={yScale(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="font-mono"
                  fontSize={9}
                  fill="var(--bone-dim)"
                >
                  {tick}
                </text>
              </g>
            ))}

            {selected.map((id, idx) => {
              const values = points.series.get(id) ?? [];
              const d = values
                .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
                .join(" ");
              const lastV = values[values.length - 1];
              return (
                <g key={id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={categoricalColor(idx)}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx={xScale(values.length - 1)} cy={yScale(lastV)} r={5} fill="var(--chart-surface)" />
                  <circle cx={xScale(values.length - 1)} cy={yScale(lastV)} r={4} fill={categoricalColor(idx)} />
                </g>
              );
            })}

            {hoverIndex !== null && (
              <line
                x1={xScale(hoverIndex)}
                x2={xScale(hoverIndex)}
                y1={MARGIN.top}
                y2={H - MARGIN.bottom}
                stroke="var(--chrome)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
            )}
          </svg>
        </>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {players.slice(0, 15).map((p) => {
          const isSelected = selected.includes(p.playerId);
          const colorIndex = selected.indexOf(p.playerId);
          return (
            <button
              key={p.playerId}
              onClick={() => toggle(p.playerId)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
              style={{
                borderColor: isSelected ? categoricalColor(colorIndex) : "var(--felt-700)",
                color: isSelected ? "var(--bone)" : "var(--bone-dim)",
              }}
            >
              {isSelected && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: categoricalColor(colorIndex) }}
                />
              )}
              {p.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 font-mono text-[10px] text-bone-dim">
        Tocca un nome per aggiungerlo/toglierlo dal confronto (max {MAX_SERIES})
      </p>
    </div>
  );
}
