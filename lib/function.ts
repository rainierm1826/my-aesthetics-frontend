import { DeleteResponse } from "./types/types";
import { useAuthStore } from "@/provider/store/authStore";
import { refreshToken } from "@/api/auth";

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
    let response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 - Token expired, try to refresh
    if (response.status === 401) {
      try {
        const authStore = useAuthStore.getState();
        const currentToken = authStore.access_token;

        if (currentToken) {
          const refreshResponse = await refreshToken(currentToken);
          
          if (refreshResponse.status && refreshResponse.access_token) {
            // Update the token in store
            authStore.refreshAccessToken(refreshResponse.access_token);
            
            // Update authorization header with new token
            headers["Authorization"] = `Bearer ${refreshResponse.access_token}`;
            
            // Retry the original request with new token
            response = await fetch(`${backendUrl}${endpoint}`, {
              ...options,
              headers,
            });
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, proceed with original 401 response
      }
    }

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
  // Parse as local time, not UTC
  const [datePart, timePart] = strDate.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = (timePart || "00:00:00").split(":").map(Number);
  
  const date = new Date(year, month - 1, day, hours, minutes, seconds || 0);

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
    // Parse "YYYY-MM-DD HH:MM:SS" format directly without timezone conversion
    const [, timePart] = time.split(" ");
    if (!timePart) return "N/A";
    
    const [hours, minutes] = timePart.split(":").map(Number);
    
    // Convert 24-hour to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = String(minutes).padStart(2, "0");
    
    return `${displayHours}:${displayMinutes} ${period}`;
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
  token,
}: {
  id: string;
  url: string;
  token?: string;
}): Promise<DeleteResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/${url}/${id}`, {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }
    const result: DeleteResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
