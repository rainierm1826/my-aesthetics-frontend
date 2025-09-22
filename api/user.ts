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
