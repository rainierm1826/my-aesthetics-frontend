import { Suspense } from "react";
import DashboardCard from "@/components/cards/DashboardCard";
import OwnerWrapper from "@/components/ManagementWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import AppointmentTable from "@/components/tables/AppointmentTable";
import { getAllAppointments } from "@/api/appointment";

export default async function AppointmentsPage({
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
    queryKey: ["appointment"],
    queryFn: () => getAllAppointments({ page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <OwnerWrapper title="Manage Appointments">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <Suspense fallback={<Skeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <AppointmentTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
