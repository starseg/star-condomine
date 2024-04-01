import { Skeleton } from "../ui/skeleton";

export function SkeletonLobbyCard() {
  return (
    <div
      className="bg-stone-900 p-4 rounded-md flex items-center
      justify-evenly flex-wrap gap-4 mb-4 max-h-[25rem] overflow-x-auto"
    >
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
      <Skeleton className="lg:w-[30%] md:w-[45%] w-full h-[170px] rounded" />
    </div>
  );
}
