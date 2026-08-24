import { API_URL } from "./api-url";

export { API_URL };

/** Dove si viene mandati quando il database è sospeso. */
const PAGINA_ATTESA = "/servizio-non-disponibile?causa=database";

/**
 * Fetch da un Client Component: passa dal proxy same-origin /api (vedi next.config.ts)
 * così il cookie di sessione viene impostato sul dominio del frontend, non su quello
 * del backend — necessario perché i Server Component leggano la sessione via cookies().
 *
 * Gestisce anche il database sospeso (503 con `code: "DB_DOWN"` dal middleware requireDb),
 * distinguendo due casi, perché non meritano la stessa risposta:
 *  · in lettura (GET) non c'è niente da perdere → si va alla schermata che spiega il
 *    problema e ricarica da sola. È il caso del login, che altrimenti mostra una griglia
 *    di giocatori vuota e sembra un'app rotta;
 *  · in scrittura l'utente ha appena compilato un modulo → si lascia la pagina dov'è e si
 *    lancia il messaggio chiaro, così lo legge senza perdere quello che ha inserito.
 */
export async function clientFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `Errore ${res.status}` }));

    if (res.status === 503 && body?.code === "DB_DOWN") {
      const inLettura = !init?.method || init.method.toUpperCase() === "GET";
      const giaLì =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/servizio-non-disponibile");

      if (inLettura && typeof window !== "undefined" && !giaLì) {
        window.location.href = PAGINA_ATTESA;
      }
    }

    throw new Error(body.error || `Errore ${res.status}`);
  }
  return res.json();
}
