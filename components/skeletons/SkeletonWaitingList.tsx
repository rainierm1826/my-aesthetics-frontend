import React from 'react'
import { Skeleton } from '../ui/skeleton';

const SkeletonWaitingList = () => {
  return (
    <>
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
    </>
  );
};

export default SkeletonWaitingList