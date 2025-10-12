import { DeleteResponse } from "./types/types";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const isFormData = options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => "");
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export function buildParams(params: Record<string, unknown>): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.set(key, String(value));
    }
  });
  return urlParams.toString();
}

export function toLongDate(strDate: string) {
  const date = new Date(strDate);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const formatCurrency = (amount: number) => {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


export const formatTo12HourTime = (time: string | null): string => {
  if (!time) return "N/A";

  try {
    const date = new Date(time);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // avoid timezone shift
    });
  } catch (error) {
    console.error("Error formatting time:", time, error);
    return "N/A";
  }
};

export function formatNumber(number: number) {
  if (number)
    if (number >= 1_000_000_000) {
      return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
}

export async function deleteData({
  id,
  url,
}: {
  id: string;
  url: string;
}): Promise<DeleteResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/${url}/${id}`, {
      method: "PATCH",
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
