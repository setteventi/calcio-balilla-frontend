import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { SkeletonBlock, SkeletonHeader, SkeletonRows } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <SkeletonHeader />
      <PageBody className="space-y-6">
        {[0, 1].map((g) => (
          <div key={g}>
            <SkeletonBlock className="h-3 w-40" />
            <div className="mt-3">
              <SkeletonRows rows={3} height="h-[68px]" />
            </div>
          </div>
        ))}
      </PageBody>
      <BottomNav />
    </PageShell>
  );
}
