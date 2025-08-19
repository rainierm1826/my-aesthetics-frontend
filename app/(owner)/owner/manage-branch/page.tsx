// app/(owner)/owner/manage-branch/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import OwnerWrapper from "@/components/OwnerWrapper";
import DashboardCard from "@/components/DashboardCard";
import { getAllBranches } from "@/api/branch";
import BranchTable from "@/components/BranchTable";

export default async function BranchPage({
  searchParams,
}: {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};

  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawQuery = getFirst(sp.query);
  const rawPage = getFirst(sp.page) || "1";
  const rawLimit = getFirst(sp.limit) || "10";

  const query = rawQuery;
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 10;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["branch", { query, page, limit }],
    queryFn: () => getAllBranches({ query, page, limit }),
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
