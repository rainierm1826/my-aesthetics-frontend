import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonTable = () => {
  return (
    <div className="w-full" aria-busy="true">
      {/* Card wrapper */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        {/* Header: title + search + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b bg-muted/50">
          <div className="flex items-center gap-4 min-w-0">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-8 w-32 rounded" />{" "}
              {/* filter placeholder */}
              <Skeleton className="h-8 w-8 rounded-full" /> {/* icon */}
            </div>
            <Skeleton className="h-10 w-[220px] md:w-[320px] rounded" />{" "}
            {/* search box */}
            <Skeleton className="h-10 w-36 rounded" /> {/* new item button */}
          </div>
        </div>

        {/* Table header row (visual only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 items-center border-b bg-muted/30">
          <div className="col-span-1">
            <Skeleton className="h-4 w-6 rounded" />
          </div>
          <div className="col-span-4">
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="col-span-2 text-right">
            <Skeleton className="h-4 w-16 rounded ml-auto" />
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4"
            >
              {/* Left side: avatar/checkbox + main info */}
              <div className="flex items-center gap-3 min-w-0 md:flex-1">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />{" "}
                {/* avatar */}
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-48 rounded mb-2" />
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </div>

              {/* Middle: metadata/badges */}
              <div className="hidden sm:flex items-center gap-4 md:flex-1 md:justify-start">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-3 justify-end md:w-48">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination / controls footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;
