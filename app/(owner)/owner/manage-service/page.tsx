import DashboardCard from "@/components/DashboardCard";
import OwnerWrapper from "@/components/OwnerWrapper";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllService } from "@/api/service";
import ServiceTable from "@/components/ServiceTable";

export default async function ServicePage({
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
    queryKey: ["service"],
    queryFn: () => getAllService({ page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <OwnerWrapper title="Manage Services">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>

        <HydrationBoundary state={dehydratedState}>
          <ServiceTable />
        </HydrationBoundary>
      </div>
    </OwnerWrapper>
  );
}
