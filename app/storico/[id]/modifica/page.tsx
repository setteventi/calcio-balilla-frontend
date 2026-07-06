import Link from "next/link";
import { serverFetch } from "@/lib/api.server";
import type { MatchListItem, PlayerPublic } from "@/lib/types";
import { MatchForm } from "@/components/MatchForm";
import { BottomNav } from "@/components/BottomNav";

export default async function ModificaPartitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, players] = await Promise.all([
    serverFetch<MatchListItem>(`/matches/${id}`),
    serverFetch<PlayerPublic[]>("/auth/players"),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <Link
          href="/storico"
          className="font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-amber"
        >
          ← Torna allo storico
        </Link>
        <h1 className="mt-2 font-display text-4xl text-bone">
          Correggi <span className="text-amber">risultato</span>
        </h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-6 pt-5">
        <MatchForm players={players} mode="edit" matchId={id} initialMatch={match} />
      </main>

      <BottomNav />
    </div>
  );
}
