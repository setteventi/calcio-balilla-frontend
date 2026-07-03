import { API_URL } from "./api-url";

export { API_URL };

/**
 * Fetch da un Client Component: usa il cookie del browser via credentials:"include".
 */
export async function clientFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `Errore ${res.status}` }));
    throw new Error(body.error || `Errore ${res.status}`);
  }
  return res.json();
}
