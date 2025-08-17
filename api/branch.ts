import {
  BranchListResponse,
  BranchResponse,
  DeleteResponse,
  GetBranchesParams,
} from "@/lib/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postBranch(data: unknown): Promise<BranchResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }

    console.log("Sending JSON data:", data);

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
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllBranches({
  search = "",
  page = 1,
  limit = 12,
}: GetBranchesParams = {}): Promise<BranchListResponse> {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  query.set("page", String(page));
  query.set("limit", String(limit));

  try {
    const response = await fetch(`${backendUrl}/branch?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.status) {
      throw new Error(`error: ${response.status}`);
    }
    const result: BranchListResponse = await response.json();
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
    const result: BranchListResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
