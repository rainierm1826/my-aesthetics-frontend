import {
  BranchListResponse,
  BranchNameResponse,
  BranchResponse,
  GetBranchesParams,
} from "@/lib/types/branch-types";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postBranch(data: unknown): Promise<BranchResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/branch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: BranchResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function patchBranch(data: unknown): Promise<BranchResponse> {
  try {
    const response = await fetch(`${backendUrl}/branch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.status) {
      throw new Error(`error: ${response.status}`);
    }
    const result: BranchResponse = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllBranches({
  query,
  page,
  limit,
}: GetBranchesParams): Promise<BranchListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));

  try {
    const res = await fetch(`${backendUrl}/branch?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: BranchListResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getBranchName() {
  try {
    const response = await fetch(`${backendUrl}/branch/branch-name`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw Error("Internal error");
    }
    const result: BranchNameResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteBranch(branch_id: {
  branch_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/branch`, {
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
