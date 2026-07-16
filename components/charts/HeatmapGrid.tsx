"use client";

import { useMemo, useState } from "react";
import { divergingColor, divergingOpacity } from "@/lib/chartColors";
import type { PlayerPublic } from "@/lib/types";

export interface HeatmapCell {
  value: number | null; // null = nessun dato (mai giocato insieme / mai incontrati)
  belowThreshold: boolean;
}

/**
 * La formattazione dipende dal tipo di matrice, ma non può arrivare come funzione:
 * i Server Component possono passare ai client solo dati serializzabili.
 */
export type HeatmapMode = "synergy" | "headToHead";

interface HeatmapGridProps {
  title: string;
  subtitle: string;
  players: PlayerPublic[];
  center: number;
  /** Matrice precalcolata sul server: cells[riga][colonna], stesso ordine di `players`. */
  cells: HeatmapCell[][];
  mode: HeatmapMode;
  legendLowLabel: string;
  legendHighLabel: string;
}

function initials(name: string): string {
  return name.slice(0, 3);
}

function formatValue(mode: HeatmapMode, value: number): string {
  if (mode === "synergy") {
    return `${value >= 0 ? "+" : ""}${Math.round(value * 100)}`;
  }
  return `${Math.round(value * 100)}%`;
}

function detailLabel(
  mode: HeatmapMode,
  rowName: string,
  colName: string,
  cell: HeatmapCell
): string {
  const suffix = cell.belowThreshold ? " (campione ridotto)" : "";

  if (mode === "synergy") {
    if (cell.value === null) return `${rowName} + ${colName}: non hanno mai giocato insieme`;
    return `${rowName} + ${colName}: sinergia ${formatValue(mode, cell.value)}${suffix}`;
  }

  if (cell.value === null) return `${rowName} vs ${colName}: non si sono mai affrontati`;
  return `${rowName} vs ${colName}: ${formatValue(mode, cell.value)} vittorie per ${rowName}${suffix}`;
}

export function HeatmapGrid({
  title,
  subtitle,
  players,
  center,
  cells,
  mode,
  legendLowLabel,
  legendHighLabel,
}: HeatmapGridProps) {
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

  const maxAbsDeviation = useMemo(() => {
    let max = 0;
    for (let r = 0; r < players.length; r++) {
      for (let c = 0; c < players.length; c++) {
        if (r === c) continue;
        const cell = cells[r]?.[c];
        if (!cell || cell.value === null || cell.belowThreshold) continue;
        max = Math.max(max, Math.abs(cell.value - center));
      }
    }
    return max || 1;
  }, [players.length, cells, center]);

  const detail = selected
    ? detailLabel(
        mode,
        players[selected.row]?.name ?? "?",
        players[selected.col]?.name ?? "?",
        cells[selected.row]?.[selected.col] ?? { value: null, belowThreshold: false }
      )
    : null;

  if (players.length < 2) {
    return (
      <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
        <h2 className="font-display text-2xl text-bone">{title}</h2>
        <p className="mt-3 font-mono text-sm text-bone-dim">Servono almeno 2 giocatori.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <h2 className="font-display text-2xl text-bone">{title}</h2>
      <p className="font-mono text-[11px] text-bone-dim">{subtitle}</p>

      <p className="mt-2 min-h-[2.5rem] font-mono text-sm text-bone">
        {detail ?? "Tocca una cella per i dettagli"}
      </p>

      <div className="mt-2 overflow-x-auto">
        <div
          className="grid w-max"
          style={{
            gridTemplateColumns: `44px repeat(${players.length}, 30px)`,
          }}
        >
          <div />
          {players.map((col) => (
            <div
              key={col.id}
              className="flex items-end justify-center pb-1 font-mono text-[9px] text-bone-dim"
              title={col.name}
            >
              {initials(col.name)}
            </div>
          ))}

          {players.map((row, r) => (
            <div key={row.id} className="contents">
              <div
                className="flex items-center truncate pr-1 font-mono text-[10px] text-bone-dim"
                title={row.name}
              >
                {row.name}
              </div>
              {players.map((col, c) => {
                const isDiagonal = r === c;
                const cell = isDiagonal ? null : cells[r]?.[c] ?? null;
                const isSelected = selected?.row === r && selected?.col === c;
                const interactive = !isDiagonal && cell !== null && cell.value !== null;

                let background = "var(--felt-800)";
                let opacity = 1;
                if (cell && cell.value !== null && !cell.belowThreshold) {
                  background = divergingColor(cell.value - center);
                  opacity = divergingOpacity(cell.value - center, maxAbsDeviation);
                } else if (cell && cell.belowThreshold && cell.value !== null) {
                  background = divergingColor(cell.value - center);
                  opacity = 0.3;
                } else if (isDiagonal) {
                  opacity = 0.15;
                } else {
                  opacity = 0.2;
                }

                return (
                  <button
                    key={col.id}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && setSelected({ row: r, col: c })}
                    className="m-px h-[30px] w-[30px] rounded-sm transition-transform disabled:cursor-default"
                    style={{
                      background,
                      opacity,
                      outline: isSelected ? "2px solid var(--bone)" : "none",
                      outlineOffset: -2,
                    }}
                    aria-label={
                      isDiagonal
                        ? undefined
                        : `${row.name} vs ${col.name}: ${
                            cell && cell.value !== null
                              ? formatValue(mode, cell.value)
                              : "nessun dato"
                          }`
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[10px] text-bone-dim">{legendLowLabel}</span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--chart-neg), var(--chart-diverging-mid), var(--chart-pos))",
          }}
        />
        <span className="font-mono text-[10px] text-bone-dim">{legendHighLabel}</span>
      </div>
    </div>
  );
}
