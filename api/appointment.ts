import { apiRequest, buildParams, getTodayDate } from "@/lib/function";
import {
  AppointmentListResponse,
  AppointmentResponse,
  GetAppointmentParams,
} from "@/lib/types/appointment-types";
import { AvailableSlotsApiResponse } from "@/lib/types/aesthetician-types";
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
  const today = date ?? getTodayDate();
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

export async function getAppointmentAvailableSlots({
  branch_id,
  service_id,
  date,
  token,
  aesthetician_id,
  usePost = false,
}: {
  branch_id: string;
  service_id: string;
  date: string;
  token: string;
  aesthetician_id?: string;
  usePost?: boolean;
}): Promise<AvailableSlotsApiResponse> {
  if (usePost) {
    // POST body for multi-service support (single-service for now)
    const body = JSON.stringify({
      services: [
        {
          branch_id,
          service_id,
          date,
          ...(aesthetician_id ? { aesthetician_id } : {}),
        },
      ],
    });
    return apiRequest<AvailableSlotsApiResponse>(
      `/appointment/available-slots`,
      {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }
    );
  } else {
    const params = buildParams({ 
      branch_id, 
      service_id, 
      date,
      ...(aesthetician_id && { aesthetician_id })
    });
    return apiRequest<AvailableSlotsApiResponse>(
      `/appointment/available-slots?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
