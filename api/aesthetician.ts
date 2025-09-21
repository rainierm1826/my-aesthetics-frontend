import { apiRequest, buildParams } from "@/lib/function";
import {
  AestheticianListResponse,
  AestheticianNameResponse,
  AestheticianResponse,
  GetAestheticianParams,
} from "@/lib/types/aesthetician-types";

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
  console.log(params)

  return apiRequest<AestheticianListResponse>(`/aesthetician?${params}`);
}

export async function getAesthetician(aesthetician_id?: string) {
  return apiRequest<AestheticianResponse>(
    `/aesthetician/${aesthetician_id}`
  );
}

export async function getAestheticianName(branch?: string) {
  const queryString = buildParams({branch})
  return apiRequest<AestheticianNameResponse>(
    `/aesthetician/aesthetician-name${queryString}`
  );
}

export async function postAesthetician(
  data?: FormData
): Promise<AestheticianResponse> {
  return apiRequest<AestheticianResponse>("/aesthetician", {
    method: "POST",
    body: data,
    headers: {},
  });
}

export async function patchAesthetician(
  data?: FormData
): Promise<AestheticianResponse> {
  return apiRequest<AestheticianResponse>("/aesthetician", {
    method: "PATCH",
    body: data,
    headers: {},
  });
}
