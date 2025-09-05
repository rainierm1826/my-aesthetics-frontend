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
  branch = "",
  date,
  status
}: GetAppointmentParams): Promise<AppointmentListResponse> {
  const today = new Date().toISOString().split("T")[0];

  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("branch", String(branch));
  params.set("date", date ?? today);
  params.set("status", String(status));

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
    console.log(body.message);

    if (!response.ok) {
      throw new Error(body.message);
    }
    return body as AppointmentResponse;
  } catch (error) {
    throw error;
  }
}

export async function patchAppointment(
  data: unknown
): Promise<AppointmentResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/appointment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));
    console.log(body.message);

    if (!response.ok) {
      throw new Error(body.message);
    }
    return body as AppointmentResponse;
  } catch (error) {
    throw error;
  }
}

export async function deleteAppointment(appointment_id: {
  appointment_id: string;
}): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${backendUrl}/appointment`, {
      method: "DELETE",
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
