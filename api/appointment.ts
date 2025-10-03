import { apiRequest, buildParams } from "@/lib/function";
import {
  AppointmentListResponse,
  AppointmentResponse,
  GetAppointmentParams,
} from "@/lib/types/appointment-types";
import { DeleteResponse } from "@/lib/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllAppointments({
  query,
  page,
  limit,
  branch,
  date,
  status,
  token,
}: GetAppointmentParams): Promise<AppointmentListResponse> {
  const today = date ?? new Date().toISOString().split("T")[0];
  const params = buildParams({
    query,
    page,
    limit,
    branch,
    status,
    date: today,
  });
  return apiRequest<AppointmentListResponse>(`/appointment/all?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getHistory({
  token,
}: GetAppointmentParams): Promise<AppointmentListResponse> {
  return apiRequest<AppointmentListResponse>(`/appointment/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function postAppointment({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>("/appointment", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchAppointment({
  data,
  token,
}: {
  data: unknown;
  token: string;
}): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>("/appointment", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
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

export async function deleteAppointment(appointment_id: {
  appointment_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/appointment`, {
      method: "PATCH",
      body: JSON.stringify(appointment_id),
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
