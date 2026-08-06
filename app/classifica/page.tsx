import { serverFetch } from "@/lib/api.server";
import type { PlayerStats } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";
import { ClassificaList } from "@/components/classifica/ClassificaList";
import { ClassificaHeader } from "@/components/classifica/ClassificaHeader";

export default async function ClassificaPage() {
  const stats = await serverFetch<PlayerStats[]>("/stats/players");

  return (
    <div className="flex min-h-screen flex-col">
      <ClassificaHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-6 pt-5">
        <ClassificaList stats={stats} />
      </main>

      <BottomNav />
    </div>
  );
}
