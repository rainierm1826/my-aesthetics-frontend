import OwnerWrapper from "@/components/OwnerWrapper";
import SalesDashboard from "@/components/SalesDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function SalesDashboardPage() {
  return (
    <OwnerWrapper title="Sales Dashboard">
      <Suspense fallback={<Skeleton />}>
        <SalesDashboard />
      </Suspense>
    </OwnerWrapper>
  );
}
