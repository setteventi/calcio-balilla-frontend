import { serverFetch } from "@/lib/api.server";
import type {
  HeadToHeadStats,
  MatchTimelineEntry,
  PairStats,
  PlayerPublic,
  PlayerStats,
} from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { EloHistoryChart } from "@/components/charts/EloHistoryChart";
import { PlayerRadarChart } from "@/components/charts/PlayerRadarChart";
import { HeatmapGrid, type HeatmapCell } from "@/components/charts/HeatmapGrid";

import { ActivityCalendar } from "@/components/charts/ActivityCalendar";
import { MarginBoxPlot } from "@/components/charts/MarginBoxPlot";

function pairKey(a: string, b: string) {
  return [a, b].sort().join("|");
}

export default async function AnalisiPage() {
  const [me, playerStats, pairs, headToHead, timeline] = await Promise.all([
    serverFetch<{ id: string; name: string }>("/auth/me"),
    serverFetch<PlayerStats[]>("/stats/players"),
    serverFetch<PairStats[]>("/stats/pairs"),
    serverFetch<HeadToHeadStats[]>("/stats/head-to-head"),
    serverFetch<MatchTimelineEntry[]>("/stats/timeline"),
  ]);

  // Ordine classifica (già per ELO decrescente) per righe/colonne delle heatmap
  const orderedPlayers: PlayerPublic[] = playerStats.map((s) => ({ id: s.playerId, name: s.name }));

  const pairsByKey = new Map(pairs.map((p) => [pairKey(p.playerAId, p.playerBId), p]));
  const h2hByKey = new Map(headToHead.map((h) => [pairKey(h.playerAId, h.playerBId), h]));

  function synergyCell(rowId: string, colId: string): HeatmapCell {
    const pair = pairsByKey.get(pairKey(rowId, colId));
    if (!pair) return { value: null, belowThreshold: false };
    const value = pair.synergyScore ?? pair.winRateTogether - 0.5;
    return { value, belowThreshold: pair.belowThreshold };
  }

  function headToHeadCell(rowId: string, colId: string): HeatmapCell {
    const h2h = h2hByKey.get(pairKey(rowId, colId));
    if (!h2h) return { value: null, belowThreshold: false };
    const rowIsA = h2h.playerAId === rowId;
    const value = rowIsA ? h2h.aWinRateAgainstB : 1 - h2h.aWinRateAgainstB;
    return { value, belowThreshold: h2h.belowThreshold };
  }

  // Le matrici vanno precalcolate qui: ai Client Component si possono passare
  // solo dati serializzabili, non funzioni.
  const buildMatrix = (cellFor: (rowId: string, colId: string) => HeatmapCell): HeatmapCell[][] =>
    orderedPlayers.map((row) =>
      orderedPlayers.map((col) =>
        row.id === col.id ? { value: null, belowThreshold: false } : cellFor(row.id, col.id)
      )
    );

  const synergyMatrix = buildMatrix(synergyCell);
  const headToHeadMatrix = buildMatrix(headToHeadCell);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">Analisi</p>
        <h1 className="font-display text-4xl text-bone">
          Dentro i <span className="text-amber">dati</span>
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-6 pt-5">
        <EloHistoryChart players={playerStats} timeline={timeline} currentPlayerId={me.id} />

        <PlayerRadarChart players={playerStats} currentPlayerId={me.id} />

        <HeatmapGrid
          title="Sinergia coppie"
          subtitle="Quanto una coppia rende meglio/peggio della media dei singoli"
          players={orderedPlayers}
          center={0}
          cells={synergyMatrix}
          mode="synergy"
          legendLowLabel="Sotto media"
          legendHighLabel="Sopra media"
        />

        <HeatmapGrid
          title="Head-to-head"
          subtitle="Riga contro colonna: percentuale di vittorie della riga"
          players={orderedPlayers}
          center={0.5}
          cells={headToHeadMatrix}
          mode="headToHead"
          legendLowLabel="Perde di più"
          legendHighLabel="Vince di più"
        />

        <ActivityCalendar timeline={timeline} />

        <MarginBoxPlot timeline={timeline} />
      </main>

      <BottomNav />
    </div>
  );
}
