"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/api";
import type { CreateMatchInput, MatchListItem, MatchRole, PlayerPublic } from "@/lib/types";

const ROLES: { value: MatchRole; label: string }[] = [
  { value: "attacco", label: "ATT" },
  { value: "difesa", label: "DIF" },
  { value: "misto", label: "MIX" },
];

interface Slot {
  playerId: string;
  role: MatchRole;
}

function emptySlot(role: MatchRole): Slot {
  return { playerId: "", role };
}

function slotsFromMatch(match: MatchListItem): {
  teamA: [Slot, Slot];
  teamB: [Slot, Slot];
  winner: "A" | "B";
  scoreA: string;
  scoreB: string;
} {
  return {
    teamA: [
      { playerId: match.team_a_player1.id, role: match.team_a_player1_role },
      { playerId: match.team_a_player2.id, role: match.team_a_player2_role },
    ],
    teamB: [
      { playerId: match.team_b_player1.id, role: match.team_b_player1_role },
      { playerId: match.team_b_player2.id, role: match.team_b_player2_role },
    ],
    winner: match.winner_team,
    scoreA: match.score_a !== null ? String(match.score_a) : "",
    scoreB: match.score_b !== null ? String(match.score_b) : "",
  };
}

interface MatchFormProps {
  players: PlayerPublic[];
  mode?: "create" | "edit";
  matchId?: string;
  initialMatch?: MatchListItem;
}

export function MatchForm({ players, mode = "create", matchId, initialMatch }: MatchFormProps) {
  const router = useRouter();
  const initial = initialMatch ? slotsFromMatch(initialMatch) : null;

  const [teamA, setTeamA] = useState<[Slot, Slot]>(
    initial?.teamA ?? [emptySlot("attacco"), emptySlot("difesa")]
  );
  const [teamB, setTeamB] = useState<[Slot, Slot]>(
    initial?.teamB ?? [emptySlot("attacco"), emptySlot("difesa")]
  );
  const [winner, setWinner] = useState<"A" | "B" | null>(initial?.winner ?? null);
  const [scoreA, setScoreA] = useState(initial?.scoreA ?? "");
  const [scoreB, setScoreB] = useState(initial?.scoreB ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const chosenIds = useMemo(
    () => [teamA[0].playerId, teamA[1].playerId, teamB[0].playerId, teamB[1].playerId].filter(Boolean),
    [teamA, teamB]
  );

  function availableFor(current: string) {
    return players.filter((p) => p.id === current || !chosenIds.includes(p.id));
  }

  function updateSlot(
    team: "A" | "B",
    index: 0 | 1,
    patch: Partial<Slot>
  ) {
    const setter = team === "A" ? setTeamA : setTeamB;
    setter((prev) => {
      const next = [...prev] as [Slot, Slot];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  const canSubmit =
    chosenIds.length === 4 && new Set(chosenIds).size === 4 && winner !== null && !submitting;

  function handleScoreChange(team: "A" | "B", value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 2);
    const setter = team === "A" ? setScoreA : setScoreB;
    setter(digits);

    const otherValue = team === "A" ? scoreB : scoreA;
    if (digits !== "" && otherValue !== "") {
      const a = Number(team === "A" ? digits : otherValue);
      const b = Number(team === "A" ? otherValue : digits);
      if (a !== b) setWinner(a > b ? "A" : "B");
    }
  }

  async function submit() {
    if (!canSubmit || !winner) return;

    const hasScoreA = scoreA !== "";
    const hasScoreB = scoreB !== "";
    if (hasScoreA !== hasScoreB) {
      setError("Inserisci il punteggio di entrambe le squadre, o di nessuna");
      return;
    }
    if (hasScoreA && hasScoreB) {
      const a = Number(scoreA);
      const b = Number(scoreB);
      if (a === b) {
        setError("Non può esserci pareggio");
        return;
      }
      if ((a > b ? "A" : "B") !== winner) {
        setError("Il punteggio non corrisponde alla squadra vincitrice selezionata");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateMatchInput = {
        team_a_player1_id: teamA[0].playerId,
        team_a_player1_role: teamA[0].role,
        team_a_player2_id: teamA[1].playerId,
        team_a_player2_role: teamA[1].role,
        team_b_player1_id: teamB[0].playerId,
        team_b_player1_role: teamB[0].role,
        team_b_player2_id: teamB[1].playerId,
        team_b_player2_role: teamB[1].role,
        winner_team: winner,
        ...(hasScoreA && hasScoreB ? { score_a: Number(scoreA), score_b: Number(scoreB) } : {}),
      };

      if (mode === "edit" && matchId) {
        await clientFetch(`/matches/${matchId}`, { method: "PUT", body: JSON.stringify(payload) });
        router.push("/storico");
        router.refresh();
        return;
      }

      await clientFetch("/matches", { method: "POST", body: JSON.stringify(payload) });
      setSuccess(true);
      setTeamA([emptySlot("attacco"), emptySlot("difesa")]);
      setTeamB([emptySlot("attacco"), emptySlot("difesa")]);
      setWinner(null);
      setScoreA("");
      setScoreB("");
      router.refresh();
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError((e as Error).message || "Errore nell'inserimento");
    } finally {
      setSubmitting(false);
    }
  }

  const isEdit = mode === "edit";

  return (
    <div className="rounded-2xl border border-felt-line bg-felt-panel p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-amber">
          {isEdit ? "Modifica partita" : "Nuova partita"}
        </h2>
        {success && (
          <span className="font-mono text-xs uppercase tracking-widest text-amber">
            Salvata ✓
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <TeamBox
          label="Squadra A"
          slots={teamA}
          onChangePlayer={(i, id) => updateSlot("A", i, { playerId: id })}
          onChangeRole={(i, role) => updateSlot("A", i, { role })}
          availableFor={availableFor}
          selected={winner === "A"}
          onSelectWinner={() => setWinner("A")}
        />

        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-felt-line" />
          <div className="flex items-center gap-2">
            <input
              value={scoreA}
              onChange={(e) => handleScoreChange("A", e.target.value)}
              inputMode="numeric"
              placeholder="—"
              aria-label="Punti squadra A"
              className="h-9 w-9 shrink-0 rounded-md border border-felt-line bg-felt-950 text-center font-mono text-sm text-bone outline-none focus:border-amber"
            />
            <span className="font-display text-lg text-bone-dim">VS</span>
            <input
              value={scoreB}
              onChange={(e) => handleScoreChange("B", e.target.value)}
              inputMode="numeric"
              placeholder="—"
              aria-label="Punti squadra B"
              className="h-9 w-9 shrink-0 rounded-md border border-felt-line bg-felt-950 text-center font-mono text-sm text-bone outline-none focus:border-amber"
            />
          </div>
          <div className="h-px flex-1 bg-felt-line" />
        </div>

        <TeamBox
          label="Squadra B"
          slots={teamB}
          onChangePlayer={(i, id) => updateSlot("B", i, { playerId: id })}
          onChangeRole={(i, role) => updateSlot("B", i, { role })}
          availableFor={availableFor}
          selected={winner === "B"}
          onSelectWinner={() => setWinner("B")}
        />
      </div>

      <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-bone-dim">
        Tocca la squadra vincitrice o inserisci il punteggio (opzionale)
      </p>

      {error && <p className="mt-3 font-mono text-sm text-led-red">{error}</p>}

      <button
        disabled={!canSubmit}
        onClick={submit}
        className="mt-4 w-full rounded-xl bg-amber py-3 font-display text-xl tracking-wide text-white transition-colors disabled:bg-felt-line disabled:text-bone-dim"
      >
        {submitting ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Registra risultato"}
      </button>
    </div>
  );
}

function TeamBox({
  label,
  slots,
  onChangePlayer,
  onChangeRole,
  availableFor,
  selected,
  onSelectWinner,
}: {
  label: string;
  slots: [Slot, Slot];
  onChangePlayer: (index: 0 | 1, id: string) => void;
  onChangeRole: (index: 0 | 1, role: MatchRole) => void;
  availableFor: (current: string) => PlayerPublic[];
  selected: boolean;
  onSelectWinner: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelectWinner}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectWinner();
        }
      }}
      className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-3 text-left transition-colors ${
        selected ? "border-amber bg-felt-raised" : "border-felt-line bg-felt-950/40"
      }`}
    >
      <span
        className={`font-mono text-[11px] uppercase tracking-widest ${
          selected ? "text-amber" : "text-bone-dim"
        }`}
      >
        {label} {selected && "🏆"}
      </span>

      {([0, 1] as const).map((i) => (
        <div key={i} className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
          <select
            value={slots[i].playerId}
            onChange={(e) => onChangePlayer(i, e.target.value)}
            className="w-full rounded-lg border border-felt-line bg-felt-950 px-2 py-2 font-mono text-sm text-bone"
          >
            <option value="">— giocatore —</option>
            {availableFor(slots[i].playerId).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => onChangeRole(i, r.value)}
                className={`flex-1 rounded-md border py-1 font-mono text-[10px] tracking-widest transition-colors ${
                  slots[i].role === r.value
                    ? "border-amber text-amber"
                    : "border-felt-line text-bone-dim"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
