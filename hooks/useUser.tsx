"use client";

import { getUser } from "@/api/user";
import { UserResponse } from "@/lib/user-type";
import { useAuthStore } from "@/provider/store/authStore";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const { auth } = useAuthStore();

  return useQuery<UserResponse, Error>({
    queryKey: ["user", auth?.account_id],
    queryFn: () => getUser({ account_id: auth!.account_id }),
    enabled: !!auth?.account_id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
