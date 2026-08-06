import { serverFetch } from "@/lib/api.server";
import { BottomNav } from "@/components/BottomNav";
import { ProfileForm } from "@/components/ProfileForm";
import { PageBody, PageHeader, PageShell } from "@/components/ui/Page";

export default async function ProfiloPage() {
  const me = await serverFetch<{ id: string; name: string }>("/auth/me");

  return (
    <PageShell>
      <PageHeader eyebrow="Profilo" title={me.name} />

      <PageBody>
        <ProfileForm currentName={me.name} />
      </PageBody>

      <BottomNav />
    </PageShell>
  );
}
