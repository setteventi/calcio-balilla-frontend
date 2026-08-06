import Link from "next/link";
import type { PlayerStats } from "@/lib/types";
import { IconCrown, IconTrophy } from "@/components/icons";

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Righe di dettaglio comuni a tutte le posizioni. */
function Meta({ s }: { s: PlayerStats }) {
  return (
    <p className="font-mono text-caption text-bone-dim">
      {s.matchesPlayed} partite · {pct(s.winRate)} vittorie
    </p>
  );
}

/** Sul podio i due dati stanno su righe distinte: mandarli a capo da soli
 *  produceva un a-capo casuale a metà frase. */
function MetaStacked({ s }: { s: PlayerStats }) {
  return (
    <p className="font-mono text-caption leading-snug text-bone-dim">
      {s.matchesPlayed} partite
      <br />
      {pct(s.winRate)} vittorie
    </p>
  );
}

/** L'asta segmentata che sostituisce la barra piena del peso. */
function RodMeter({ share, tone }: { share: number; tone: string }) {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-felt-950">
      <div
        className={`rod-meter ${tone}`}
        style={{ width: `${Math.max(8, share * 100)}%` }}
      />
    </div>
  );
}

export function ClassificaList({ stats }: { stats: PlayerStats[] }) {
  if (stats.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-felt-700 px-6 py-12 text-center">
        <IconTrophy className="mx-auto size-8 text-bone-dim opacity-50" />
        <p className="font-display mt-3 text-lead text-bone">
          Nessuna partita registrata
        </p>
        <p className="font-mono mt-1 text-caption text-bone-dim">
          Registra la prima e la classifica si costruisce da sé.
        </p>
        <Link
          href="/"
          className="font-mono mt-5 inline-block rounded-full bg-amber px-5 py-2 text-caption font-bold uppercase tracking-widest text-felt-950 transition-transform duration-[var(--dur-instant)] active:scale-[0.97]"
        >
          Gioca ora
        </Link>
      </div>
    );
  }

  const [primo, secondo, terzo, ...resto] = stats;

  return (
    <div className="space-y-3">
      {/* --- il campione: unica superficie con il bagliore --- */}
      <Link
        href={`/giocatore/${primo.playerId}`}
        style={{ "--i": 0 } as React.CSSProperties}
        className="snap-rank surface-champion relative block overflow-hidden rounded-2xl px-5 pb-4 pt-5 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-soft)] active:scale-[0.99]"
      >
        {/* Numero decorativo tagliato dal bordo: rompe il rettangolo senza
            aggiungere testo da leggere. Sta a sinistra per non finire dietro
            al punteggio, che è il dato più importante della schermata. */}
        <span
          aria-hidden
          className="font-display pointer-events-none absolute -bottom-10 -left-2 select-none text-[10rem] leading-none text-amber opacity-[0.07]"
        >
          1
        </span>

        <div className="relative flex items-center gap-2 text-amber">
          <IconCrown className="size-4" />
          <span className="font-mono text-eyebrow font-bold uppercase tracking-[0.18em]">
            Numero uno
          </span>
        </div>

        <div className="relative mt-2 flex items-end justify-between gap-3">
          <h2 className="font-display text-h2 leading-none text-bone">
            {primo.name}
          </h2>
          <span className="scoreboard-digit text-podio leading-none text-amber">
            {primo.elo}
          </span>
        </div>

        <div className="relative mt-3 flex items-center justify-between">
          <Meta s={primo} />
          <span className="font-mono text-caption text-bone-dim">
            peso {pct(primo.weightShare)}
          </span>
        </div>
        <div className="relative mt-2">
          <RodMeter share={primo.weightShare} tone="text-amber" />
        </div>
      </Link>

      {/* --- secondo e terzo, affiancati --- */}
      {(secondo || terzo) && (
        <div className="grid grid-cols-2 gap-3">
          {[secondo, terzo].filter(Boolean).map((s, idx) => (
            <Link
              key={s.playerId}
              href={`/giocatore/${s.playerId}`}
              style={{ "--i": idx + 1 } as React.CSSProperties}
              className="snap-rank surface-raised flex flex-col items-center rounded-2xl px-3 pb-3 pt-4 text-center transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-soft)] active:scale-[0.99]"
            >
              <span className="font-display text-2xl leading-none text-chrome opacity-70">
                {idx + 2}
              </span>
              <span className="font-display mt-1 text-lead leading-tight text-bone">
                {s.name}
              </span>
              <span className="scoreboard-digit mt-1 text-xl text-cyan">
                {s.elo}
              </span>
              <div className="mt-2 w-full">
                <MetaStacked s={s} />
              </div>
              <div className="mt-2 w-full">
                <RodMeter share={s.weightShare} tone="text-cyan" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* --- dal quarto in giù: righe compatte, ritmo diverso --- */}
      {resto.length > 0 && (
        <>
          <div className="flex items-center gap-3 pt-2">
            <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
              Inseguitori
            </span>
            <div className="rod-divider flex-1" />
          </div>

          <ul className="space-y-2">
            {resto.map((s, idx) => (
              <li
                key={s.playerId}
                style={{ "--i": Math.min(idx + 3, 7) } as React.CSSProperties}
                className="snap-rank"
              >
                <Link
                  href={`/giocatore/${s.playerId}`}
                  className="surface flex items-center gap-3 rounded-xl px-3 py-2.5 transition-[border-color,background-color] duration-[var(--dur-fast)] hover:border-amber active:scale-[0.99]"
                >
                  <span className="font-mono w-5 text-center text-caption text-bone-dim">
                    {idx + 4}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display truncate text-lead text-bone">
                        {s.name}
                      </span>
                      {/* Niente bagliore qui: il glow resta un privilegio del
                          podio, altrimenti smette di significare qualcosa. */}
                      <span className="font-mono text-body font-bold tabular-nums text-chrome">
                        {s.elo}
                      </span>
                    </div>
                    <div className="mt-0.5">
                      <Meta s={s} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
