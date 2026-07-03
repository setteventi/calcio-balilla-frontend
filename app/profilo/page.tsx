import { serverFetch } from "@/lib/api.server";
import { BottomNav } from "@/components/BottomNav";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfiloPage() {
  const me = await serverFetch<{ id: string; name: string }>("/auth/me");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Profilo
        </p>
        <h1 className="font-display text-4xl text-bone">{me.name}</h1>
        <div className="rod-divider mt-3" />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-6 pt-5">
        <ProfileForm currentName={me.name} />
      </main>

      <BottomNav />
    </div>
  );
}
