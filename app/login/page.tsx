"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/api";
import type { PlayerPublic } from "@/lib/types";

type Mode = "select" | "pin" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerPublic[]>([]);
  const [mode, setMode] = useState<Mode>("select");
  const [selected, setSelected] = useState<PlayerPublic | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    clientFetch<PlayerPublic[]>("/auth/players")
      .then(setPlayers)
      .catch(() => setError("Impossibile caricare i giocatori"));
  }, []);

  function attemptLogin(fullPin: string) {
    if (!selected || loading) return;
    setLoading(true);
    clientFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ playerId: selected.id, pin: fullPin }),
    })
      .then(() => router.push("/"))
      .catch((e) => {
        setError(e.message || "PIN errato");
        setPin("");
      })
      .finally(() => setLoading(false));
  }

  function attemptRegister(fullPin: string) {
    if (!newName.trim() || loading) return;
    setLoading(true);
    clientFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: newName.trim(), pin: fullPin }),
    })
      .then(() => router.push("/"))
      .catch((e) => {
        setError(e.message || "Impossibile registrarsi");
        setPin("");
      })
      .finally(() => setLoading(false));
  }

  function pressDigit(d: string) {
    if (loading || pin.length >= 4) return;
    setError(null);
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (mode === "register") attemptRegister(next);
      else attemptLogin(next);
    }
  }

  function backspace() {
    setError(null);
    setPin((p) => p.slice(0, -1));
  }

  function reset() {
    setMode("select");
    setSelected(null);
    setPin("");
    setError(null);
    setNewName("");
  }

  if (mode === "select") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
        <h1 className="font-display text-5xl text-amber">Chi gioca?</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-bone-dim">
          Seleziona il tuo nome
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelected(p);
                setMode("pin");
              }}
              className="rounded-xl border border-felt-line bg-felt-panel px-4 py-5 text-left font-display text-2xl text-bone transition-colors hover:border-amber hover:text-amber active:scale-[0.98]"
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMode("register")}
          className="mt-6 rounded-xl border border-dashed border-felt-line px-4 py-4 text-center font-mono text-sm uppercase tracking-widest text-bone-dim transition-colors hover:border-amber hover:text-amber"
        >
          + Non ci sei? Aggiungiti
        </button>

        {error && <p className="mt-4 font-mono text-sm text-led-red">{error}</p>}
      </main>
    );
  }

  if (mode === "register") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-10">
        <button
          onClick={reset}
          className="self-start font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-amber"
        >
          ← Indietro
        </button>

        <h1 className="mt-6 font-display text-4xl text-bone">Nuovo giocatore</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-bone-dim">
          Scegli nome e PIN
        </p>

        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Il tuo nome"
          maxLength={30}
          className="mt-8 w-full rounded-xl border border-felt-line bg-felt-panel px-4 py-3 text-center font-display text-2xl text-bone outline-none focus:border-amber"
        />

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-bone-dim">
          Scegli un PIN a 4 cifre
        </p>

        <PinDots length={pin.length} />

        {error && <p className="mt-4 font-mono text-sm text-led-red">{error}</p>}
        {loading && <p className="mt-4 font-mono text-sm text-bone-dim">Creazione…</p>}

        <PinPad
          disabled={loading || !newName.trim()}
          onDigit={pressDigit}
          onBackspace={backspace}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-10">
      <button
        onClick={reset}
        className="self-start font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-amber"
      >
        ← Cambia giocatore
      </button>

      <h1 className="mt-6 font-display text-4xl text-bone">
        Ciao, <span className="text-amber">{selected?.name}</span>
      </h1>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-bone-dim">
        Inserisci il PIN
      </p>

      <PinDots length={pin.length} />

      {error && <p className="mt-4 font-mono text-sm text-led-red">{error}</p>}
      {loading && <p className="mt-4 font-mono text-sm text-bone-dim">Verifica…</p>}

      <PinPad disabled={loading} onDigit={pressDigit} onBackspace={backspace} />
    </main>
  );
}

function PinDots({ length }: { length: number }) {
  return (
    <div className="mt-8 flex gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded-full border-2 border-chrome ${
            i < length ? "bg-amber border-amber" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function PinPad({
  disabled,
  onDigit,
  onBackspace,
}: {
  disabled: boolean;
  onDigit: (d: string) => void;
  onBackspace: () => void;
}) {
  return (
    <div className="mt-10 grid grid-cols-3 gap-4">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
        d === "" ? (
          <div key={i} />
        ) : (
          <button
            key={i}
            disabled={disabled}
            onClick={() => (d === "⌫" ? onBackspace() : onDigit(d))}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-felt-line font-display text-3xl text-bone transition-colors hover:border-amber hover:text-amber active:scale-95 disabled:opacity-40"
          >
            {d}
          </button>
        )
      )}
    </div>
  );
}
