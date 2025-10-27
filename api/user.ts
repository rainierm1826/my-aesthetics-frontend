import { apiRequest } from "@/lib/function";
import { UserResponse } from "@/lib/types/user-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function patchUser({
  data,
  token,
}: {
  data: FormData;
  token?: string | null;
}): Promise<UserResponse> {
  return apiRequest<UserResponse>("/user", {
    method: "PATCH",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function changePassword({
  current_password,
  new_password,
  token,
}: {
  current_password: string;
  new_password: string;
  token?: string | null;
}): Promise<{ status: boolean; message: string }> {
  return apiRequest<{ status: boolean; message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password,
      new_password,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUser(token?: string): Promise<UserResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${backendUrl}/user`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: UserResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllCustomers({
  token,
  page = 1,
  limit = 10,
  search = "",
  type = "",
  sort_by = "created_at",
  order = "desc",
}: {
  token?: string | null;
  page?: number;
  limit?: number;
  search?: string;
  type?: "online" | "walkin" | "";
  sort_by?: "created_at" | "name" | "phone";
  order?: "asc" | "desc";
} = {}): Promise<{
  status: boolean;
  message: string;
  customers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
    phone_number: string;
    type: "online" | "walkin";
    created_at: string;
    image: string | null;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    online_count: number;
    walkin_count: number;
  };
}> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (type) params.append("type", type);
  params.append("sort_by", sort_by);
  params.append("order", order);

  const queryString = params.toString();
  const endpoint = `/user/all-customers${queryString ? `?${queryString}` : ""}`;

  return apiRequest(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

