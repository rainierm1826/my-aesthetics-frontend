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
  // Next may give searchParams as a "thenable", so await it.
  searchParams,
}: {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // await searchParams to satisfy Next's synchronous-dynamic-API check
  const sp = (await searchParams) ?? {};

  // Normalize values (handle string | string[] | undefined)
  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawQuery = getFirst(sp.query);
  const rawPage = getFirst(sp.page) || "1"; // default to "1"
  const rawLimit = getFirst(sp.limit) || "10"; // default to "10"

  const query = rawQuery;
  const page = Number(rawPage) || 1; // fallback to 1 when Number(...) is NaN
  const limit = Number(rawLimit) || 10; // fallback to 10

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
