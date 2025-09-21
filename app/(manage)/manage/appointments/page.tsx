import { Suspense } from "react";
import OwnerWrapper from "@/components/ManagementWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import AppointmentTable from "@/components/tables/AppointmentTable";
import { getAllAppointments } from "@/api/appointment";
import { cookies } from "next/headers";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value || ""

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
    queryFn: () => getAllAppointments({ page, limit, token }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <OwnerWrapper title="Manage Appointments">
      <div className="">
        
        <Suspense fallback={<Skeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <AppointmentTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
