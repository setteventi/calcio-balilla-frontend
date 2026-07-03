import type { MatchListItem } from "@/lib/types";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

export function MatchRow({ match }: { match: MatchListItem }) {
  const aWon = match.winner_team === "A";
  const hasScore = match.score_a !== null && match.score_b !== null;
  return (
    <div className="flex items-center justify-between rounded-xl border border-felt-line bg-felt-panel px-3 py-2.5">
      <div className="flex flex-col gap-0.5">
        <span className={`font-mono text-sm ${aWon ? "text-amber" : "text-bone-dim"}`}>
          {match.team_a_player1.name} + {match.team_a_player2.name}
        </span>
        <span className={`font-mono text-sm ${!aWon ? "text-amber" : "text-bone-dim"}`}>
          {match.team_b_player1.name} + {match.team_b_player2.name}
        </span>
      </div>
      <div className="text-right">
        <span className="scoreboard-digit block text-lg text-amber">
          {hasScore ? `${match.score_a}-${match.score_b}` : aWon ? "A" : "B"}
        </span>
        <span className="font-mono text-[10px] text-bone-dim">
          {formatWhen(match.played_at)}
        </span>
      </div>
    </div>
  );
}
