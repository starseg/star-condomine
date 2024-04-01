import { Skeleton } from "../ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-wrap gap-4">
      <Skeleton className="h-48 w-[49%] rounded" />
      <Skeleton className="h-48 w-[49%] rounded" />
      <Skeleton className="h-48 w-[49%] rounded" />
      <Skeleton className="h-48 w-[49%] rounded" />
      <Skeleton className="h-48 w-[49%] rounded" />
      <Skeleton className="h-48 w-[49%] rounded" />
    </div>
  );
}
