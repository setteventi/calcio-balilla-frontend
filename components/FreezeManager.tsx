"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/api";
import type { FreezePeriod } from "@/lib/types";
import { IconArrowRight, IconClose, IconSnowflake } from "@/components/icons";

function formatDate(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function FreezeManager({ periods }: { periods: FreezePeriod[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add() {
    setError(null);
    if (!start || !end) {
      setError("Inserisci inizio e fine");
      return;
    }
    if (end < start) {
      setError("La fine deve essere uguale o dopo l'inizio");
      return;
    }
    setBusy(true);
    try {
      await clientFetch("/freeze", {
        method: "POST",
        body: JSON.stringify({ start_date: start, end_date: end }),
      });
      setStart("");
      setEnd("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Errore nel salvataggio");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError(null);
    try {
      await clientFetch(`/freeze/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Errore nell'eliminazione");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 border-t border-felt-line/50 pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-widest text-bone-dim hover:text-amber"
      >
        <span className="flex items-center gap-1.5">
          <IconSnowflake className="size-3.5" />
          Pausa estiva — {periods.length} period{periods.length === 1 ? "o" : "i"}
        </span>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <p className="font-mono text-[11px] text-bone-dim">
            Le partite giocate in questi giorni valgono per l&apos;ELO ma non per i giorni da n.1. Se in pausa non si gioca non serve: i giorni senza partite non contano già.
          </p>

          {periods.length > 0 && (
            <ul className="space-y-1.5">
              {periods.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-felt-line bg-felt-950/40 px-3 py-2"
                >
                  <span className="font-mono flex items-center gap-1.5 text-xs text-bone">
                    {formatDate(p.start_date)}
                    <IconArrowRight className="size-3 text-bone-dim" />
                    {formatDate(p.end_date)}
                  </span>
                  <button
                    onClick={() => remove(p.id)}
                    disabled={busy}
                    aria-label="Elimina pausa"
                    className="text-led-red transition-opacity duration-[var(--dur-fast)] hover:opacity-70 disabled:opacity-40"
                  >
                    <IconClose className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
              Inizio
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="rounded-lg border border-felt-line bg-felt-950 px-2 py-1.5 font-mono text-sm text-bone outline-none focus:border-amber"
              />
            </label>
            <label className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
              Fine
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="rounded-lg border border-felt-line bg-felt-950 px-2 py-1.5 font-mono text-sm text-bone outline-none focus:border-amber"
              />
            </label>
            <button
              onClick={add}
              disabled={busy}
              className="rounded-lg border border-amber px-3 py-1.5 font-display text-sm tracking-wide text-amber disabled:opacity-40"
            >
              Aggiungi
            </button>
          </div>

          {error && <p className="font-mono text-sm text-led-red">{error}</p>}
        </div>
      )}
    </div>
  );
}
