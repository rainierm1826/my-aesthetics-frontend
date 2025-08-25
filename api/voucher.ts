import { DeleteResponse } from "@/lib/types";
import {
  GetVoucherParams,
  VoucherListResponse,
  VoucherResponse,
} from "@/lib/voucher-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postVoucher(data: unknown): Promise<VoucherResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/voucher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: VoucherResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function patchVoucher(data: unknown): Promise<VoucherResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/voucher`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: VoucherResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllVoucher({
  query,
  page,
  limit,
  discountType,
}: GetVoucherParams): Promise<VoucherListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("discount-type", discountType);
  params.set("page", String(page));
  params.set("limit", String(limit));

  try {
    const res = await fetch(`${backendUrl}/voucher?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: VoucherListResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteVoucher(voucher_code: {
  voucher_code: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/voucher`, {
      method: "DELETE",
      body: JSON.stringify(voucher_code),
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
