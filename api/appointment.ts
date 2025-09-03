import {
  AppointmentListResponse,
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
    const res = await fetch(`${backendUrl}/appointment/all?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
