import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import OwnerWrapper from "@/components/OwnerWrapper";
import DashboardCard from "@/components/DashboardCard";
import { getAllBranches } from "@/api/branch";
import BranchTable from "@/components/BranchTable";

export default async function BranchPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["branch"],
    queryFn: () => getAllBranches(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <OwnerWrapper title="Manage Branches">
      <div className="flex flex-wrap gap-3 mb-5">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>

      <div>
        <HydrationBoundary state={dehydratedState}>
          <BranchTable />
        </HydrationBoundary>
      </div>
    </OwnerWrapper>
  );
}
