# Direzione artistica — Calcio Balilla Tracker

> Documento persistente. Se ci torni in una sessione futura: leggilo prima di
> cambiare qualcosa, e aggiornalo se la direzione cambia davvero.

## Che app è

Tracker di partite a calcio balilla per un gruppo chiuso di ~12 amici. Si apre
dal telefono in piedi vicino al tavolo, subito dopo una partita: si registra il
risultato in dieci secondi, e ogni tanto ci si perde a guardare classifiche e
statistiche. Nessuno ci lavora, tutti ci stanno per piacere.

## La tesi, in una frase

**Il tabellone a LED di un biliardino in una sala buia: la sala è scura e
materica, e l'unica cosa che brilla è il punteggio.**

Da questa frase discende tutto il resto, e va usata come giudice: se un elemento
non è un punteggio e brilla, sta rubando la luce a chi la merita.

| decisione | discende da |
|---|---|
| fondo viola-nero con trama diagonale | «la sala è buia e materica» |
| verde fluo e ciano solo sui numeri e sul leader | «l'unica cosa che brilla è il punteggio» |
| Bebas Neue compresso e maiuscolo per i titoli | insegna della sala giochi |
| Space Mono tabellare per i numeri | display a segmenti |
| movimento «snap», meccanico e corto | la targhetta che scatta in posizione |

## Registri per schermata

Assegnati con la tabella a punteggio di `registri.md`. L'app nel suo insieme
sta in **quotidiana** (sessioni brevi, poche volte al giorno, uso volontario,
nessun errore costoso: punteggio 7–8).

| rotta | registro | motivazione |
|---|---|---|
| `/classifica` | quotidiana — **il momento** | è la schermata che si mostra agli altri: «guarda dove sto» |
| `/` dashboard | quotidiana | il form è la funzione più usata: la leggibilità viene prima dell'effetto |
| `/analisi` | quotidiana | densa di grafici; il budget va sulla loro leggibilità, non su decorazione attorno |
| `/coppie`, `/storico`, `/giocatore/[id]` | quotidiana | consultazione, liste medie |
| `/profilo`, `/storico/[id]/modifica` | strumento | form di servizio: solo chiarezza e stati |
| `/login` | quotidiana | 20 secondi di vita, ma è la prima impressione |

**Il momento è `/classifica`** — e riceve il trattamento pieno: podio a tre
livelli, l'unica superficie con il bagliore, il numero decorativo tagliato dal
bordo. Le altre schermate usano lo stesso vocabolario a intensità minore.

## Token

Tutti in `app/globals.css`. I 25 token colore preesistenti **non si toccano**:
erano già la parte fatta bene.

- **Tipografia**: scala fluida `--fs-eyebrow` → `--fs-podio`. Rapporto h1/corpo
  ≈ 4.3× (banda quotidiana: 3–4.5×).
- **Spaziatura**: `--space-1` … `--space-12`.
- **Elevazione**, tre livelli. Su un fondo quasi nero un'ombra nera è invisibile:
  l'elevazione si costruisce col **bordo illuminato in alto** (`inset 0 1px`) e
  col fondo che si schiarisce. `--elev-3` include il bagliore verde ed è riservato
  al campione.
- **Movimento**: 4 durate (90/150/240/380 ms) e 3 easing. `--ease-snap` ha
  l'overshoot ed è l'unico che si sente.

## Le superfici

| classe | uso | budget |
|---|---|---|
| `.surface` | riga di lista, card di servizio | ovunque |
| `.surface-raised` | card che deve staccarsi (2°/3° posto, pannelli) | libera |
| `.surface-champion` | **solo il primo in classifica** | 1 per app |

Il bagliore verde è un privilegio del primo posto. Se compare altrove smette di
significare «sei in testa» e diventa decorazione.

## Il movimento firma

Uno solo, e ricorre: **`.snap-rank`** — la riga entra dal basso di 14 px con un
micro-overshoot, come una targhetta che scatta nella sua fessura. Stagger di
45 ms via `--i`, massimo 8 elementi.

Si usa dove qualcosa «prende posizione»: le righe di classifica, le partite
nello storico, le coppie. Non si usa sui form.

Lo stato iniziale nascosto vive **dentro** `@media (prefers-reduced-motion:
no-preference)`. È la trappola classica: metterlo fuori significa che con la
riduzione del movimento attiva il contenuto resta invisibile per sempre.

## Regole che valgono ovunque

1. **Niente emoji come icone.** Le icone sono in `components/icons.tsx`, SVG a
   `currentColor`, tratto 2, dimensione via classe.
2. **I numeri sono tabellari** (`tabular-nums` o `.scoreboard-digit`): in una
   classifica le cifre devono stare incolonnate.
3. **Il glow non si spalma.** Un elemento con bagliore per schermata.
4. **La gerarchia prima dell'effetto.** Se una schermata non si legge a colpo
   d'occhio, il problema non si risolve aggiungendo un gradiente.
5. **Contenuto sempre nel render server.** Nessun testo che appare solo via JS.

## Primitive

In `components/ui/`. **Niente `cva` né `tailwind-merge`**: il progetto ha zero
dipendenze oltre a Next e React, e per cinque primitive con 2–3 varianti
sarebbero peso di bundle senza guadagno. Se le varianti crescono, si rivaluta.

- `Page.tsx` — `PageShell`, `PageHeader`, `PageBody`
- `Text.tsx` — `Eyebrow`, `Caption`, `SectionTitle`, `SectionRule`
- `Skeleton.tsx` — `SkeletonBlock`, `SkeletonHeader`, `SkeletonRows`

Le superfici (`.surface`, `.surface-raised`, `.surface-champion`) restano classi
CSS e non componenti: si applicano a tag diversi (`div`, `a`, `li`, `section`) e
un wrapper avrebbe solo aggiunto un livello senza togliere codice.

## Verifica — prima / dopo

Misure di `scripts/diagnosi.mjs`, stessa app, stesso script.

| metrica | prima | dopo |
|---|---|---|
| emoji usate come icone | 5 | **0** |
| durate di transizione esplicite | 5 | **14** |
| `loading.tsx` (pagine coperte) | 0 / 10 | **6 / 9** |
| `error.tsx` (pagine coperte) | 0 / 10 | **9 / 9** |
| `not-found.tsx` / `global-error.tsx` | assenti | **presenti** |
| stringhe di classi ripetute ≥ 3× | 17 | **11** |
| rapporto h1 / corpo | 1.5× | **4.29×** |

Controlli a schermo, su dati reali:

- tre viewport (390 / 768 / 1280): nessun overflow, nessuna collisione
- contrasto sul DOM renderizzato: minimo **8.78:1** (richiesto 4.5:1)
- console senza errori
- `prefers-reduced-motion`: `.snap-rank` è dichiarata **solo** dentro
  `(prefers-reduced-motion: no-preference)` → con la riduzione attiva non c'è
  animazione e il contenuto resta visibile

Le 11 duplicazioni residue sono utility tipografiche dentro i componenti dei
grafici (`font-mono text-caption text-bone-dim` e simili). Sostituirle in massa
avrebbe richiesto di riscrivere componenti già verificati per un guadagno
marginale: le primitive esistono e vanno usate nel codice nuovo.

## Cosa non fare (visto in questo progetto)

- Ripetere `max-w-md` su ogni schermata con lo stesso ritmo verticale: era il
  difetto principale della versione precedente — dieci schermate identiche nella
  struttura, distinguibili solo dal testo.
- Dare a tutte le card lo stesso peso: se tutto è in evidenza, niente lo è.
- Barre di avanzamento piene per il «peso»: si usa `.rod-meter`, l'asta
  segmentata, che richiama le aste del biliardino.
