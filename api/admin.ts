import {
  AdminListResposne,
  AdminResponse,
  GetAdminParams,
} from "@/lib/types/admin-type";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function patchAdmin(data: unknown): Promise<AdminResponse> {

  try {
    const response = await fetch(`${backendUrl}/admin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.status) {
      throw new Error(`error: ${response.status}`);
    }
    const result: AdminResponse = await response.json();
    console.log(result)
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAdmin(account_id: {
  account_id: string;
}): Promise<DeleteResponse> {

  try {
    const response = await fetch(`${backendUrl}/auth/delete-admin`, {
      method: "DELETE",
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
}: GetAdminParams): Promise<AdminListResposne> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("branch", String(branch));
  try {
    const res = await fetch(`${backendUrl}/admin/all?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AdminListResposne = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}
