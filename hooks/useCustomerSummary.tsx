"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCustomerSummary,
  CustomerSummaryResponse,
} from "@/api/customer-analytics";

interface UseCustomerSummaryProps {
  token: string;
}

export const useCustomerSummary = ({ token }: UseCustomerSummaryProps) => {
  return useQuery<CustomerSummaryResponse, Error>({
    queryKey: ["customer-summary"],
    queryFn: () => getCustomerSummary(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
