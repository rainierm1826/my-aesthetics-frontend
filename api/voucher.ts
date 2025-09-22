import { apiRequest, buildParams } from "@/lib/function";
import { DeleteResponse } from "@/lib/types/types";
import {
  GetVoucherParams,
  VoucherListResponse,
  VoucherResponse,
} from "@/lib/types/voucher-type";

export async function postVoucher({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<VoucherResponse> {
  return apiRequest<VoucherResponse>("/voucher", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchVoucher({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<VoucherResponse> {
  return apiRequest<VoucherResponse>("/voucher", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAllVoucher({
  query,
  page,
  limit,
  discountType,
}: GetVoucherParams): Promise<VoucherListResponse> {
  const params = buildParams({ query, page, limit, discountType });
  return apiRequest<VoucherListResponse>(`/voucher?${params}`);
}

export async function deleteVoucher({
  voucher_code,
  token,
}: {
  voucher_code: string;
  token: string;
}): Promise<DeleteResponse> {
  return apiRequest<DeleteResponse>("/voucher", {
    method: "PATCH",
    body: JSON.stringify(voucher_code),
    headers: { Authorization: `Bearer ${token}` },
  });
}
