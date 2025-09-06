import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonId() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>

        {/* Right Column - Details Skeleton */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Price */}
          <div>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 flex-shrink-0" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-7 w-48 mb-6" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// components/skeletons/ServiceSkeleton.tsx
export function ServiceSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full relative">
            <Skeleton className="w-full h-full rounded-lg" />
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>

        {/* Right Column - Details Skeleton */}
        <div className="space-y-6">
          {/* Title and Category */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Description */}
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 flex-shrink-0" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-7 w-48 mb-6" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// components/skeletons/BranchSkeleton.tsx
export function BranchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full relative">
            <Skeleton className="w-full h-full rounded-lg" />
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Address */}
          <div>
            <Skeleton className="h-5 w-16 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 flex-shrink-0" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-7 w-48 mb-6" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
