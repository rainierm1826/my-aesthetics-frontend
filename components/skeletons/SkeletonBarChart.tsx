import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonBarChart() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between min-h-[300px] h-[300px] w-full space-x-2">
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[180px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[220px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[160px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[240px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[200px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <Skeleton className="w-full h-[190px] mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {/* Y-axis labels */}
        <div className="flex justify-between mt-4">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
