import {
  AestheticianListResponse,
  AestheticianResponse,
  GetAestheticianParams,
} from "@/lib/aesthetician-types";
import { DeleteResponse } from "@/lib/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllAesthetician({
  query,
  page,
  limit,
  availability="",
  branch="",
  experience="",
  sex="",
}: GetAestheticianParams): Promise<AestheticianListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("availability", String(availability));
  params.set("branch", String(branch));
  params.set("experience", String(experience));
  params.set("sex", String(sex));

  try {
    const res = await fetch(`${backendUrl}/aesthetician?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AestheticianListResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function postAesthetician(data: unknown): Promise<AestheticianResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/aesthetician`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: AestheticianResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function patchAesthetician(data: unknown): Promise<AestheticianResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/aesthetician`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: AestheticianResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteAesthetician(aesthetician_id: {
  aesthetician_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/aesthetician`, {
      method: "DELETE",
      body: JSON.stringify(aesthetician_id),
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
