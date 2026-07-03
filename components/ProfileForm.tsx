"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/api";

export function ProfileForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    setSuccess(false);

    if (!currentPin) {
      setError("Inserisci il PIN attuale per confermare");
      return;
    }
    if (newPin && newPin !== confirmPin) {
      setError("I due PIN nuovi non coincidono");
      return;
    }

    setSaving(true);
    try {
      await clientFetch("/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          currentPin,
          newName: name.trim() !== currentName ? name.trim() : undefined,
          newPin: newPin || undefined,
        }),
      });
      setSuccess(true);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">
          Nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="mt-1 w-full rounded-xl border border-felt-line bg-felt-panel px-4 py-3 font-display text-xl text-bone outline-none focus:border-amber"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">
            Nuovo PIN
          </label>
          <input
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            placeholder="opzionale"
            className="mt-1 w-full rounded-xl border border-felt-line bg-felt-panel px-4 py-3 font-mono text-lg text-bone outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">
            Conferma PIN
          </label>
          <input
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            placeholder="opzionale"
            className="mt-1 w-full rounded-xl border border-felt-line bg-felt-panel px-4 py-3 font-mono text-lg text-bone outline-none focus:border-amber"
          />
        </div>
      </div>

      <div className="rod-divider" />

      <div>
        <label className="font-mono text-[11px] uppercase tracking-widest text-amber">
          PIN attuale (per confermare)
        </label>
        <input
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          className="mt-1 w-full rounded-xl border border-amber/50 bg-felt-panel px-4 py-3 font-mono text-lg text-bone outline-none focus:border-amber"
        />
      </div>

      {error && <p className="font-mono text-sm text-led-red">{error}</p>}
      {success && (
        <p className="font-mono text-sm text-amber">Modifiche salvate ✓</p>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="w-full rounded-xl bg-amber py-3 font-display text-xl tracking-wide text-felt-950 transition-opacity disabled:opacity-30"
      >
        {saving ? "Salvataggio…" : "Salva modifiche"}
      </button>
    </div>
  );
}
