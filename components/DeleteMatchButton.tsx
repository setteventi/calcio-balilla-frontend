"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/api";

export function DeleteMatchButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doDelete() {
    setDeleting(true);
    setError(null);
    try {
      await clientFetch(`/matches/${matchId}`, { method: "DELETE" });
      router.push("/storico");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Errore nell'eliminazione");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setConfirming(true)}
          className="w-full rounded-xl border border-led-red/40 py-3 font-display text-lg tracking-wide text-led-red transition-colors hover:border-led-red"
        >
          Elimina partita
        </button>
        {error && <p className="mt-2 font-mono text-sm text-led-red">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-led-red/40 bg-felt-panel p-4">
      <p className="font-mono text-sm text-bone">
        Eliminare questa partita? L&apos;azione non è reversibile.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="flex-1 rounded-xl border border-felt-line py-3 font-display text-lg tracking-wide text-bone-dim transition-colors hover:text-bone disabled:opacity-40"
        >
          Annulla
        </button>
        <button
          onClick={doDelete}
          disabled={deleting}
          className="flex-1 rounded-xl bg-led-red py-3 font-display text-lg tracking-wide text-white transition-opacity disabled:opacity-40"
        >
          {deleting ? "Elimino…" : "Elimina"}
        </button>
      </div>
    </div>
  );
}
