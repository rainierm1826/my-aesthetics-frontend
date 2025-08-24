import { getAllAdmin } from "@/api/admin";
import AdminTable from "@/components/AdminTable";
import DashboardCard from "@/components/DashboardCard";
import OwnerWrapper from "@/components/OwnerWrapper";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AdminPage({
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
    queryKey: ["admin", "account", { query, page, limit }],
    queryFn: () => getAllAdmin({ query, page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <OwnerWrapper title="Manage Admins">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <HydrationBoundary state={dehydratedState}>
          <AdminTable />
        </HydrationBoundary>
      </div>
    </OwnerWrapper>
  );
}
