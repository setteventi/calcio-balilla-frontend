import { BottomNav } from "@/components/BottomNav";
import { PageBody, PageShell } from "@/components/ui/Page";
import { SkeletonBlock, SkeletonHeader, SkeletonRows } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <SkeletonHeader />
      <PageBody className="space-y-3">
        {/* Ricalca il podio: campione alto, poi due card affiancate, poi righe. */}
        <SkeletonBlock className="h-32" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
        </div>
        <div className="pt-2">
          <SkeletonRows rows={4} height="h-14" />
        </div>
      </PageBody>
      <BottomNav />
    </PageShell>
  );
}
