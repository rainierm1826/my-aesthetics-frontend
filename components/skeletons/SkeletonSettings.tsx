"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonSettings() {
  return (
    <div className="space-y-6 p-6">
      {/* Top Card: Predictive Features & Branch Management */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            {/* Icon + Title */}
            <Skeleton className="h-6 w-6 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-5 w-72 mb-2" /> {/* Title */}
              <Skeleton className="h-3 w-1/2" /> {/* Description */}
            </div>
          </div>

          <div className="mt-6">
            <Separator className="my-6" />

            {/* Predictive Analytics row */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-44 mb-1" /> {/* label */}
                <Skeleton className="h-3 w-80" /> {/* subtext */}
              </div>

              <div className="ml-4">
                <Skeleton className="h-6 w-12 rounded-full" /> {/* switch */}
              </div>
            </div>

            <div className="my-6">
              <Separator />
            </div>

            {/* Collapsible placeholder (trigger + content preview) */}
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-56 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-4 rounded" />
              </div>

              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-md border bg-white"
                  >
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="ml-4">
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch Overview Card */}
      <Card className="shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle>
            <Skeleton className="h-4 w-44" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-3 w-72 mt-2" />
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border rounded-md p-4 min-h-[76px] bg-transparent"
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <div className="ml-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
