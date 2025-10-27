import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import OwnerWrapper from "@/components/wrapper/ManagementWrapper";
import { getAllCustomers } from "@/api/user";
import CustomerTable from "@/components/tables/CustomerTable";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";

export default async function CustomerPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};

  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawQuery = getFirst(sp.query);
  const rawPage = getFirst(sp.page) || "1";
  const rawLimit = getFirst(sp.limit) || "10";

  const search = rawQuery;
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 10;

  // Get token from cookies
  const cookieStore = await cookies();
  const authStorage = cookieStore.get("auth-storage");
  let access_token = "";
  
  if (authStorage?.value) {
    try {
      const auth = JSON.parse(authStorage.value);
      access_token = auth.state?.access_token || "";
    } catch {
      access_token = "";
    }
  }

  const queryClient = new QueryClient();
  
  if (access_token) {
    await queryClient.prefetchQuery({
      queryKey: ["all-customers", { page, limit, search, type: "", sort_by: "created_at", order: "desc" }],
      queryFn: () => getAllCustomers({ token: access_token, page, limit, search }),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <OwnerWrapper title="Manage Customers">
      <div>
        <Suspense fallback={<Skeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <CustomerTable />
          </HydrationBoundary>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
