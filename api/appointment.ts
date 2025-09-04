import {
  AppointmentListResponse,
  AppointmentResponse,
  GetAppointmentParams,
} from "@/lib/types/appointment-types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllAppointments({
  query,
  page,
  limit,
  branch = "",
}: GetAppointmentParams): Promise<AppointmentListResponse> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("branch", String(branch));

  try {
    const res = await fetch(
      `${backendUrl}/appointment/all?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AppointmentListResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function postAppointment(
  data: unknown
): Promise<AppointmentResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message);
    }
    return body as AppointmentResponse;
  } catch (error) {
    throw error;
  }
}
