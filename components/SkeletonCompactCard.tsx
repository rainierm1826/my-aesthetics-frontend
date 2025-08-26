import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCompactCard() {
  return (
    <div className="p-4 border rounded-lg w-full max-w-sm shadow-sm border-none">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
