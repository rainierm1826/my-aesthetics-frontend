import { AdminResponse } from "@/lib/admin-type";

export async function patchUser(data: unknown): Promise<AdminResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/admin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: AdminResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}