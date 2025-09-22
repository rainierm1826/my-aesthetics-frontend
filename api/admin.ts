import { apiRequest, buildParams } from "@/lib/function";
import {
  AdminListResposne,
  AdminResponse,
  GetAdminParams,
} from "@/lib/types/admin-type";
import { DeleteResponse } from "@/lib/types/types";


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

export async function deleteAdmin({
  admin_id,
  token,
}: {
  admin_id: string;
  token: string;
}): Promise<DeleteResponse> {
  return apiRequest<DeleteResponse>("/auth/delete-admin", {
    method: "PATCH",
    body: JSON.stringify(admin_id),
    headers: { Authorization: `Bearer ${token}` },
  });
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
