"use client";

/** Cattura gli errori del layout radice: qui i CSS dell'app possono non essere
 *  ancora applicati, perciò gli stili minimi sono inline. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#0a0714",
          color: "#f4eefc",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Qualcosa si è rotto</h1>
        <p style={{ opacity: 0.7, margin: 0, fontSize: "0.875rem" }}>
          {error.digest ? `Riferimento: ${error.digest}` : "Errore imprevisto."}
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            border: 0,
            borderRadius: 999,
            padding: "0.6rem 1.4rem",
            background: "#39ff14",
            color: "#0a0714",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Riprova
        </button>
      </body>
    </html>
  );
}
