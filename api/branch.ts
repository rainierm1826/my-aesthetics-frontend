import { apiRequest, buildParams } from "@/lib/function";
import {
  BranchListResponse,
  BranchResponse,
  GetBranchesParams,
} from "@/lib/types/branch-types";
import { DeleteResponse } from "@/lib/types/types";
import { AvailableSlotsResponse } from "@/lib/types/aesthetician-types";

export async function postBranch({
  data,
  token,
}: {
  data?: FormData;
  token: string;
}): Promise<BranchResponse> {
  return apiRequest<BranchResponse>("/branch", {
    method: "POST",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchBranch({
  data,
  token,
}: {
  data?: FormData;
  token: string;
}): Promise<BranchResponse> {
  return apiRequest<BranchResponse>("/branch", {
    method: "PATCH",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAllBranches({
  query,
  page,
  limit,
}: GetBranchesParams): Promise<BranchListResponse> {
  const params = buildParams({ query, page, limit });
  return apiRequest<BranchListResponse>(`/branch?${params}`);
}

export async function getBranchName() {
  return apiRequest<BranchListResponse>(`/branch/branch-name`);
}

export async function getBranch(branch_id: string) {
  return apiRequest<BranchResponse>(`/branch/${branch_id}`);
}

export async function deleteBranch({
  branch_id,
  token,
}: {
  branch_id: string;
  token: string;
}): Promise<DeleteResponse> {
  return apiRequest<DeleteResponse>("/branch", {
    method: "PATCH",
    body: JSON.stringify(branch_id),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getBranchAvailableSlots({
  branch_id,
  service_id,
  date,
  token,
}: {
  branch_id: string;
  service_id: string;
  date: string;
  token: string;
}): Promise<AvailableSlotsResponse> {
  const queryString = buildParams({ service_id, date });
  return apiRequest<AvailableSlotsResponse>(
    `/branch/${branch_id}/available-slots?${queryString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
