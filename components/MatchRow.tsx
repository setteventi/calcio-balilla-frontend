import Link from "next/link";
import type { MatchListItem } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  });
}

export function MatchRow({
  match,
  /** Nello storico la data sta già nell'intestazione di giornata: ripeterla
   *  in ogni riga è rumore. Nella dashboard invece serve. */
  showDay = true,
}: {
  match: MatchListItem;
  showDay?: boolean;
}) {
  const aWon = match.winner_team === "A";
  const hasScore = match.score_a !== null && match.score_b !== null;

  return (
    <Link
      href={`/storico/${match.id}/modifica`}
      className="surface group flex items-stretch gap-3 rounded-xl px-3 py-2.5 transition-colors duration-[var(--dur-fast)] hover:border-amber"
    >
      {/* Barretta di lato: dice a colpo d'occhio quale delle due righe ha vinto,
          senza doverne leggere il colore del testo. */}
      <span
        aria-hidden
        className="my-0.5 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-amber to-transparent"
        style={aWon ? undefined : { background: "linear-gradient(to top, var(--led-amber), transparent)" }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`font-mono truncate text-body ${aWon ? "text-amber" : "text-bone-dim"}`}
        >
          {match.team_a_player1.name} + {match.team_a_player2.name}
        </span>
        <span
          className={`font-mono truncate text-body ${!aWon ? "text-amber" : "text-bone-dim"}`}
        >
          {match.team_b_player1.name} + {match.team_b_player2.name}
        </span>
      </div>

      <div className="shrink-0 text-right">
        <span className="scoreboard-digit block text-lg text-amber">
          {hasScore ? `${match.score_a}-${match.score_b}` : aWon ? "A" : "B"}
        </span>
        <span className="font-mono text-caption text-bone-dim">
          {showDay ? `${formatDay(match.played_at)} · ` : ""}
          {formatTime(match.played_at)}
        </span>
      </div>
    </Link>
  );
}
