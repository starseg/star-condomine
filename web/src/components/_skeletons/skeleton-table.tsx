import { Skeleton } from "../ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
    </div>
  );
}
