// components/charts/PieChart.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonPieChart() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-8 min-h-[150px]">
          {/* Pie chart circle */}
          <div className="relative">
            <Skeleton className="w-48 h-48 rounded-full" />
            {/* Optional: Add some slice indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-white rounded-full opacity-30" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
