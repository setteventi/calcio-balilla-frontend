/**
 * Blocchi segnaposto che ricalcano la forma del contenuto vero: uno skeleton
 * che non ha la stessa silhouette produce uno scatto al momento del caricamento.
 */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

/** Testata: occhiello + titolone + asta. */
export function SkeletonHeader() {
  return (
    <header className="px-5 pt-8">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="mt-3 h-10 w-3/5" />
      <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
    </header>
  );
}

/** Lista di righe di uguale altezza. */
export function SkeletonRows({ rows = 5, height = "h-16" }: { rows?: number; height?: string }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonBlock key={i} className={height} />
      ))}
    </div>
  );
}
