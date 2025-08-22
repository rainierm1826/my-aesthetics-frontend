import {
  GetServiceParams,
  ServiceListResponse,
  ServiceResponse,
} from "@/lib/service-types";
import { DeleteResponse } from "@/lib/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postService(data: unknown): Promise<ServiceResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ServiceResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function patchService(data: unknown): Promise<ServiceResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/service`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ServiceResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllService({
  query,
  page,
  limit,
}: GetServiceParams): Promise<ServiceListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));

  try {
    const res = await fetch(`${backendUrl}/service?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: ServiceListResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteService(branch_id: {
  branch_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/service`, {
      method: "DELETE",
      body: JSON.stringify(branch_id),
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
