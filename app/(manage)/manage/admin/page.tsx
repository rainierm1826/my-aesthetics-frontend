import { getAllAdmin } from "@/api/admin";
import AdminTable from "@/components/tables/AdminTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { cookies } from "next/headers";
import OwnerWrapper from "@/components/wrapper/ManagementWrapper";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value || ""

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
    queryFn: () => getAllAdmin({ query, page, limit, token:token}),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <OwnerWrapper title="Manage Admins">
      <div className="flex flex-wrap gap-3 mb-5"></div>
      <Suspense fallback={<Skeleton />}>
        <HydrationBoundary state={dehydratedState}>
          <AdminTable />
        </HydrationBoundary>
      </Suspense>
    </OwnerWrapper>
  );
}
