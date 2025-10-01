import OwnerWrapper from "@/components/wrapper/ManagementWrapper";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
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
