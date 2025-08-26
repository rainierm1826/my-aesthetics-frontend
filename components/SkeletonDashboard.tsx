import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonScoreBoard from "./SkeletonScoreBoard";
import SkeletonTable from "./SkeletonTable";

const SkeletonDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonScoreBoard key={index} />
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input Skeleton */}
        <div className="relative flex-1 max-w-sm">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Filter Selects + Button Skeletons */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-[140px] rounded-md" />
          <Skeleton className="h-10 w-[140px] rounded-md" />
          <Skeleton className="h-10 w-[140px] rounded-md" />
          <Skeleton className="h-10 w-[100px] rounded-md" />
          <Skeleton className="h-10 w-[160px] rounded-md" />
        </div>
      </div>

      {/* Table */}
      <SkeletonTable />
    </div>
  );
};

export default SkeletonDashboard;
