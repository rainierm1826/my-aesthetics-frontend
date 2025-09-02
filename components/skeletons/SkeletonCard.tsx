import { Card, CardAction, CardHeader } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="w-full max-w-sm overflow-hidden p-0 border-0">
      <div className="aspect-video bg-gray-200 animate-pulse" />

      <CardHeader className="space-y-3 mb-3 pl-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
      </CardHeader>

      <CardAction className="w-full p-2">
        <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
      </CardAction>
    </Card>
  );
}
