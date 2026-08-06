import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { SkeletonBlock, SkeletonHeader } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <SkeletonHeader />
      <PageBody className="space-y-6">
        {/* I grafici sono blocchi alti: lo scheletro deve avere la loro stazza,
            altrimenti la pagina fa un salto quando arrivano i dati. */}
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-80" />
      </PageBody>
      <BottomNav />
    </PageShell>
  );
}
