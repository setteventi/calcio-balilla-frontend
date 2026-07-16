// Palette dei grafici in /analisi — validata con lo script della skill dataviz
// (banda di luminosità OKLCH, soglia di chroma, separazione CVD, contrasto)
// contro la superficie delle card (--felt-900, #160e28) in dark mode.
// Non aggiungere colori qui senza rivalidare: vedi app/globals.css per i dettagli.

// Ordine fisso, mai ciclato: oltre CATEGORICAL.length serie, filtrare invece
// di generare un nuovo colore (es. selettore giocatori nel grafico ELO).
export const CATEGORICAL: readonly string[] = [
  "var(--chart-cat-1)",
  "var(--chart-cat-2)",
  "var(--chart-cat-3)",
  "var(--chart-cat-4)",
  "var(--chart-cat-5)",
  "var(--chart-cat-6)",
];

export const DIVERGING = {
  positive: "var(--chart-pos)",
  negative: "var(--chart-neg)",
  mid: "var(--chart-diverging-mid)",
};

// Rampa sequenziale (magnitudine), un'unica tinta chiaro→scuro.
export const SEQUENTIAL: readonly string[] = [
  "var(--chart-seq-100)",
  "var(--chart-seq-200)",
  "var(--chart-seq-300)",
  "var(--chart-seq-400)",
  "var(--chart-seq-500)",
];

export function categoricalColor(index: number): string {
  return CATEGORICAL[index % CATEGORICAL.length];
}

export function sequentialColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = Math.min(SEQUENTIAL.length - 1, Math.floor(clamped * SEQUENTIAL.length));
  return SEQUENTIAL[idx];
}

export function divergingColor(value: number): string {
  if (value === 0) return DIVERGING.mid;
  return value > 0 ? DIVERGING.positive : DIVERGING.negative;
}

// Intensità del colore in base allo scarto dal centro (0.35 = ancora leggibile
// sullo sfondo scuro anche per gli scarti minimi, 1 = massimo scarto osservato).
export function divergingOpacity(value: number, maxAbs: number): number {
  if (maxAbs <= 0) return 0.35;
  const t = Math.min(1, Math.abs(value) / maxAbs);
  return 0.35 + t * 0.65;
}
