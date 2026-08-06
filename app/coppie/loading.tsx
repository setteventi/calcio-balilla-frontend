import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { SkeletonBlock, SkeletonHeader, SkeletonRows } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <SkeletonHeader />
      <PageBody className="space-y-6">
        <SkeletonBlock className="h-28" />
        <SkeletonRows rows={5} height="h-16" />
      </PageBody>
      <BottomNav />
    </PageShell>
  );
}
