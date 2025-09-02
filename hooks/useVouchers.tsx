"use client";

import { getAllVoucher } from "@/api/voucher";
import { VoucherListResponse } from "@/lib/types/voucher-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useVouchers() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const discountType = searchParams.get("discount-type") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<VoucherListResponse, Error>({
    queryKey: ["voucher", { query, limit, page, discountType }],
    queryFn: () => getAllVoucher({ query, page, limit, discountType }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
