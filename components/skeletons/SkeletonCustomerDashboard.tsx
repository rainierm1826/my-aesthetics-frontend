import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonCustomerDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-2">
      {/* Side (Waiting List Skeleton) */}
      <div className="md:w-80 w-full order-2 md:order-1 md:h-screen">
        <div className="bg-white shadow-sm p-6 border-t md:border-l border-gray-200 md:min-h-screen md:[direction:rtl]">
          <div className="md:[direction:ltr]">
            <div className="flex flex-col gap-2 mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="truncate">Waiting List</span>
              </h2>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Skeleton className="h-5 w-8" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-40 ml-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main (Booking Flow Skeleton) */}
      <div className="flex-1 flex justify-center items-center order-1 md:order-2 shadow-sm">
        <div className="flex-1 overflow-y-auto p-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80 mb-6" />

          {/* Booking Flow Steps Skeleton */}
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[...Array(4)].map((_, index) => (
                <React.Fragment key={index}>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  {index < 3 && <Skeleton className="h-1 w-12 flex-1" />}
                </React.Fragment>
              ))}
            </div>

            {/* Form content */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCustomerDashboard;