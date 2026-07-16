"use client";

import { useMemo, useState } from "react";
import type { PlayerStats } from "@/lib/types";

const W = 300;
const H = 300;
const CENTER = { x: W / 2, y: H / 2 };
const MAX_R = 100;
const RINGS = [0.25, 0.5, 0.75, 1];

interface Axis {
  key: string;
  label: string;
  getValue: (p: PlayerStats) => number | null;
}

const AXES: Axis[] = [
  { key: "elo", label: "ELO", getValue: (p) => p.elo },
  { key: "win", label: "Win %", getValue: (p) => (p.matchesPlayed > 0 ? p.winRate : null) },
  { key: "att", label: "Attacco", getValue: (p) => p.attackWinRate },
  { key: "dif", label: "Difesa", getValue: (p) => p.defenseWinRate },
  { key: "presenza", label: "Presenza", getValue: (p) => p.weightShare },
];

function percentileRank(values: number[], value: number): number {
  if (values.length <= 1) return 1;
  const below = values.filter((v) => v < value).length;
  const equal = values.filter((v) => v === value).length;
  // rank medio per i pari merito, come i percentili statistici standard
  return (below + equal / 2) / values.length;
}

function axisPoint(index: number, radiusFraction: number) {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  return {
    x: CENTER.x + Math.cos(angle) * MAX_R * radiusFraction,
    y: CENTER.y + Math.sin(angle) * MAX_R * radiusFraction,
  };
}

export function PlayerRadarChart({
  players,
  currentPlayerId,
}: {
  players: PlayerStats[];
  currentPlayerId?: string;
}) {
  const [selectedId, setSelectedId] = useState(currentPlayerId ?? players[0]?.playerId ?? "");
  const player = players.find((p) => p.playerId === selectedId);

  const percentiles = useMemo(() => {
    if (!player) return AXES.map(() => null as number | null);
    return AXES.map((axis) => {
      const value = axis.getValue(player);
      if (value === null) return null;
      const pool = players.map(axis.getValue).filter((v): v is number => v !== null);
      return percentileRank(pool, value);
    });
  }, [players, player]);

  if (players.length === 0 || !player) {
    return (
      <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
        <h2 className="font-display text-2xl text-bone">Profilo giocatore</h2>
        <p className="mt-3 font-mono text-sm text-bone-dim">Nessun giocatore disponibile.</p>
      </div>
    );
  }

  const polygonPoints = percentiles
    .map((p, i) => axisPoint(i, p ?? 0))
    .map((pt) => `${pt.x},${pt.y}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl text-bone">Profilo giocatore</h2>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-lg border border-felt-line bg-felt-950 px-2 py-1 font-mono text-xs text-bone"
        >
          {players.map((p) => (
            <option key={p.playerId} value={p.playerId}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <p className="font-mono text-[11px] text-bone-dim">
        Ogni asse è il percentile di {player.name} rispetto al resto del gruppo
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 w-full max-w-[320px]">
        {RINGS.map((r) => (
          <polygon
            key={r}
            points={AXES.map((_, i) => {
              const pt = axisPoint(i, r);
              return `${pt.x},${pt.y}`;
            }).join(" ")}
            fill="none"
            stroke="var(--chart-grid)"
            strokeWidth={1}
          />
        ))}

        {AXES.map((axis, i) => {
          const outer = axisPoint(i, 1.18);
          const spokeEnd = axisPoint(i, 1);
          return (
            <g key={axis.key}>
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={spokeEnd.x}
                y2={spokeEnd.y}
                stroke="var(--chart-grid)"
                strokeWidth={1}
              />
              <text
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                fontSize={10}
                fill="var(--bone-dim)"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        <polygon
          points={polygonPoints}
          fill="var(--chart-cat-1)"
          fillOpacity={0.12}
          stroke="var(--chart-cat-1)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {percentiles.map((p, i) => {
          if (p === null) return null;
          const pt = axisPoint(i, p);
          return <circle key={i} cx={pt.x} cy={pt.y} r={4} fill="var(--chart-cat-1)" />;
        })}
      </svg>

      <div className="mt-2 grid grid-cols-5 gap-1 text-center">
        {AXES.map((axis, i) => (
          <div key={axis.key}>
            <div className="font-mono text-[9px] uppercase tracking-wide text-bone-dim">{axis.label}</div>
            <div className="scoreboard-digit text-xs text-bone">
              {percentiles[i] === null ? "n/d" : `${Math.round((percentiles[i] ?? 0) * 100)}°`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
