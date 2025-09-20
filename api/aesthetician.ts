import {
  AestheticianListResponse,
  AestheticianNameResponse,
  AestheticianResponse,
  GetAestheticianParams,
} from "@/lib/types/aesthetician-types";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllAesthetician({
  query,
  page,
  limit,
  availability = "",
  branch = "",
  experience = "",
  sex = "",
  sort

}: GetAestheticianParams): Promise<AestheticianListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (sort) params.set("sort", String(sort))
  if (page) params.set("page", String(page));
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

export async function getAestheticianName(branch?: string) {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  try {
    const response = await fetch(
      `${backendUrl}/aesthetician/aesthetician-name?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw Error("Internal error");
    }
    const result: AestheticianNameResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAesthetician(aesthetician_id?: string) {
  try {
    const response = await fetch(
      `${backendUrl}/aesthetician/${aesthetician_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw Error("Internal error");
    }
    const result: AestheticianResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function postAesthetician(
  data?: FormData
): Promise<AestheticianResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/aesthetician`, {
      method: "POST",
      body: data
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

export async function patchAesthetician(
  data?: FormData
): Promise<AestheticianResponse> {
  try {
    const response = await fetch(`${backendUrl}/aesthetician`, {
      method: "PATCH",
      body: data
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
      method: "PATCH",
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
