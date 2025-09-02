import DashboardCard from "@/components/cards/DashboardCard";
import OwnerWrapper from "@/components/OwnerWrapper";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllVoucher } from "@/api/voucher";
import VoucherTable from "@/components/tables/VoucherTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function VoucherPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};

  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawQuery = getFirst(sp.query);
  const rawDiscountType = getFirst(sp.query);
  const rawPage = getFirst(sp.page) || "1";
  const rawLimit = getFirst(sp.limit) || "10";

  const query = rawQuery;
  const discountType = rawDiscountType;
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 10;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["voucher", { query, page, limit }],
    queryFn: () => getAllVoucher({ query, page, limit, discountType }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <OwnerWrapper title="Manage Vouchers">
      <div>
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <Suspense fallback={<Skeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <VoucherTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
