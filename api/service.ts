import {
  GetServiceParams,
  ServiceListResponse,
  ServiceNameResponse,
  ServiceResponse,
} from "@/lib/types/service-types";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postService(data?: FormData): Promise<ServiceResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/service`, {
      method: "POST",
      body: data
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

export async function patchService(data: FormData): Promise<ServiceResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/service`, {
      method: "PATCH",
      body: data
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
  branch,
  category,
}: GetServiceParams): Promise<ServiceListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (branch && branch !== "all") {
    params.set("branch", String(branch));
  }
  if (category && category !== "all") {
    params.set("category", String(category));
  }

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

export async function deleteService(service_id: {
  service_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/service/delete`, {
      method: "PATCH",
      body: JSON.stringify(service_id),
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

export async function getServiceName(branch?: string) {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  try {
    const response = await fetch(
      `${backendUrl}/service/service-name?${params}`,
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
    const result: ServiceNameResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getService(service_id?: string) {

  try {
    const response = await fetch(
      `${backendUrl}/service/${service_id}`,
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
    const result: ServiceResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
