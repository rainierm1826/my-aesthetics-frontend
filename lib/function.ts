export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  try {
    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      ...defaultHeaders,
    });

    if (!response.ok) {
      await response.text().catch(() => "");
      throw new Error(response.statusText);
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

export function formatNumber(number: number) {
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
