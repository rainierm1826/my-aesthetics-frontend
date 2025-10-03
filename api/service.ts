import { apiRequest, buildParams } from "@/lib/function";
import {
  GetServiceParams,
  ServiceListResponse,
  ServiceNameResponse,
  ServiceResponse,
} from "@/lib/types/service-types";
import { DeleteResponse } from "@/lib/types/types";

export async function postService({
  data,
  token,
}: {
  data: FormData;
  token: string;
}): Promise<ServiceResponse> {
  console.log(data)
  return apiRequest<ServiceResponse>("/service", {
    method: "POST",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchService({
  data,
  token,
}: {
  data: FormData;
  token: string;
}): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>("/service", {
    method: "PATCH",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAllService({
  query,
  page,
  limit,
  branch,
  category,
  sort,
}: GetServiceParams): Promise<ServiceListResponse> {
  const params = buildParams({ query, page, limit, branch, category, sort });
  return apiRequest<ServiceListResponse>(`/service?${params}`);
}

export async function getServiceName({
  branch,
  token,
}: {
  branch?: string;
  token: string;
}) {
  const params = buildParams({ branch });
  return apiRequest<ServiceNameResponse>(`/service/service-name?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getService(service_id?: string) {
  return apiRequest<ServiceResponse>(`/service/${service_id}`);
}

export async function deleteService({
  service_id,
  token,
}: {
  service_id: string;
  token: string;
}): Promise<DeleteResponse> {
  return apiRequest<DeleteResponse>("/service", {
    method: "PATCH",
    body: JSON.stringify(service_id),
    headers: { Authorization: `Bearer ${token}` },
  });
}
