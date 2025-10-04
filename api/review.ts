import { apiRequest } from "@/lib/function";
import {
  AppointmentResponse,
  GetReviewsParams,
  ReviewResponse,
} from "@/lib/types/appointment-types";

export async function getReviews({
  branch_id,
  aesthetician_id,
  service_id,
}: GetReviewsParams): Promise<ReviewResponse> {
  let endpoint: string | null = null;

  if (branch_id) {
    endpoint = `/appointment/reviews?branch_id=${branch_id}`;
  } else if (aesthetician_id) {
    endpoint = `/appointment/reviews?aesthetician_id=${aesthetician_id}`;
  } else if (service_id) {
    endpoint = `/appointment/reviews?service_id=${service_id}`;
  }

  if (!endpoint) {
    throw new Error(
      "You must provide branch_id, aesthetician_id, or service_id"
    );
  }

  return apiRequest<ReviewResponse>(endpoint);
}

export async function patchAppointmentReview({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>("/appointment/reviews", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}