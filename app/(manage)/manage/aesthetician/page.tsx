import { getAllAesthetician } from "@/api/aesthetician";
import AestheticianTable from "@/components/tables/AestheticianTable";
import OwnerWrapper from "@/components/wrapper/ManagementWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default async function AestheticianPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};

  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawPage = getFirst(sp.page) || "1";
  const rawLimit = getFirst(sp.limit) || "10";

  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 10;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["aesthetician"],
    queryFn: () => getAllAesthetician({ page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <OwnerWrapper title="Manage Aestheticians">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          {/* <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard /> */}
        </div>
        <Suspense fallback={<Skeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <AestheticianTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
