import { apiRequest, buildParams } from "@/lib/function";
import {
  AdminListResposne,
  AdminResponse,
  GetAdminParams,
} from "@/lib/types/admin-type";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function patchAdmin({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<AdminResponse> {
  return apiRequest<AdminResponse>("/admin", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteAdmin(account_id: {
  account_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/auth/delete-admin`, {
      method: "PATCH",
      body: JSON.stringify(account_id),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.status) {
      throw new Error(`error: ${response.status}`);
    }
    const result: DeleteResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllAdmin({
  query,
  page,
  limit,
  branch,
  token,
}: GetAdminParams): Promise<AdminListResposne> {
  const params = buildParams({ query, page, limit, branch });
  return apiRequest<AdminListResposne>(`/admin/all?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
