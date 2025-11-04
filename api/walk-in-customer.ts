import { apiRequest } from "@/lib/function";
import { DeleteResponse } from "@/lib/types/types";

interface WalkInCustomerPayload {
  first_name: string;
  last_name: string;
  middle_initial?: string;
  phone_number?: string;
}

interface WalkInCustomerUpdatePayload extends WalkInCustomerPayload {
  walk_in_id?: string;
}

export async function postWalkInCustomer({
  data,
  token,
}: {
  data: WalkInCustomerPayload;
  token: string;
}) {
  return apiRequest("/walkin", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchWalkInCustomer({
  data,
  token,
}: {
  data: WalkInCustomerUpdatePayload;
  token: string;
}) {
  return apiRequest("/walkin", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteWalkInCustomer({
  walk_in_id,
  token,
}: {
  walk_in_id: string;
  token: string;
}): Promise<DeleteResponse> {
  console.log("Deleting walk-in customer with ID:", walk_in_id, "token:", token);
  return apiRequest<DeleteResponse>("/walkin", {
    method: "DELETE",
    body: JSON.stringify({ walk_in_id }),
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
}
