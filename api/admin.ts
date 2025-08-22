import { AdminResponse } from "@/lib/admin-type";
import { DeleteResponse } from "@/lib/types";

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
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteBranch(admin_id: {
  admin_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/admin`, {
      method: "DELETE",
      body: JSON.stringify(admin_id),
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
