import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { SkeletonBlock, SkeletonHeader, SkeletonRows } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <SkeletonHeader />
      <PageBody className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-20" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
        <SkeletonRows rows={3} height="h-14" />
      </PageBody>
      <BottomNav />
    </PageShell>
  );
}
