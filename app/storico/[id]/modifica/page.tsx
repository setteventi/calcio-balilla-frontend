import Link from "next/link";
import { serverFetch } from "@/lib/api.server";
import type { MatchListItem, PlayerPublic } from "@/lib/types";
import { MatchForm } from "@/components/MatchForm";
import { DeleteMatchButton } from "@/components/DeleteMatchButton";
import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { IconArrowLeft } from "@/components/icons";

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
    <PageShell>
      <header className="relative px-5 pt-8">
        <Link
          href="/storico"
          className="font-mono inline-flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.18em] text-bone-dim transition-colors duration-[var(--dur-fast)] hover:text-amber"
        >
          <IconArrowLeft className="size-3.5" />
          Torna allo storico
        </Link>
        <h1 className="font-display mt-2 text-h1 leading-[0.95] tracking-[-0.01em] text-bone">
          Correggi <span className="text-amber">risultato</span>
        </h1>
        <div className="rod-divider mt-4 -mx-5 w-[calc(100%+2.5rem)]" />
      </header>

      <PageBody>
        <MatchForm players={players} mode="edit" matchId={id} initialMatch={match} />
        <DeleteMatchButton matchId={id} />
      </PageBody>

      <BottomNav />
    </PageShell>
  );
}
