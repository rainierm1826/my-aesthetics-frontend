import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "@/api/user";
import { useAuthStore } from "@/provider/store/authStore";

interface UseAllCustomersProps {
  page?: number;
  limit?: number;
  search?: string;
  type?: "online" | "walkin" | "";
  sort_by?: "created_at" | "name" | "phone";
  order?: "asc" | "desc";
}

export function useAllCustomers({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  sort_by = "created_at",
  order = "desc",
}: UseAllCustomersProps = {}) {
  const access_token = useAuthStore((state) => state.access_token);

  return useQuery({
    queryKey: ["all-customers", page, limit, search, type, sort_by, order],
    queryFn: () =>
      getAllCustomers({
        token: access_token,
        page,
        limit,
        search,
        type,
        sort_by,
        order,
      }),
    enabled: !!access_token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
