import { apiRequest, buildParams } from "@/lib/function";
import {
  AestheticianListResponse,
  AestheticianNameResponse,
  AestheticianResponse,
  GetAestheticianParams,
} from "@/lib/types/aesthetician-types";
import { DeleteResponse } from "@/lib/types/types";

export async function getAllAesthetician({
  availability,
  branch,
  experience,
  limit,
  page,
  query,
  sex,
  sort,
}: GetAestheticianParams): Promise<AestheticianListResponse> {
  const params = buildParams({
    availability,
    branch,
    experience,
    limit,
    page,
    query,
    sex,
    sort,
  });

  return apiRequest<AestheticianListResponse>(`/aesthetician?${params}`);
}

export async function getAesthetician(aesthetician_id?: string) {
  return apiRequest<AestheticianResponse>(`/aesthetician/${aesthetician_id}`);
}

export async function getAestheticianName({
  branch,
  token,
}: {
  branch: string;
  token: string;
}) {
  const queryString = buildParams({ branch });
  return apiRequest<AestheticianNameResponse>(
    `/aesthetician/aesthetician-name?${queryString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function postAesthetician({
  data,
  token,
}: {
  data: FormData;
  token: string;
}): Promise<AestheticianResponse> {
  return apiRequest<AestheticianResponse>("/aesthetician", {
    method: "POST",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchAesthetician({
  data,
  token,
}: {
  data?: FormData;
  token: string;
}): Promise<AestheticianResponse> {
  return apiRequest<AestheticianResponse>("/aesthetician", {
    method: "PATCH",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteAesthetician({
  aesthetician_id,
  token,
}: {
  aesthetician_id: string;
  token: string;
}): Promise<DeleteResponse> {
  return apiRequest<DeleteResponse>("/aesthetician", {
    method: "PATCH",
    body: JSON.stringify(aesthetician_id),
    headers: { Authorization: `Bearer ${token}` },
  });
}
