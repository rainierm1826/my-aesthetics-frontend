import {
  AnalyticsSummaryResponse,
  AppointmentAnalyticsResponse,
  GetAnalyticsParams,
  SalesAnalyticsResponse,
} from "@/lib/types/analytics-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAnalyticsSummary({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams): Promise<AnalyticsSummaryResponse> {

  const params = new URLSearchParams();

  if (branch) params.set("branch", branch);
  if (group_by) params.set("group-by", group_by);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  try {
    const res = await fetch(`${backendUrl}/analytics/summary${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AnalyticsSummaryResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAppointmentAnalytics({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams): Promise<AppointmentAnalyticsResponse> {

  const params = new URLSearchParams();

  if (branch) params.set("branch", branch);
  if (group_by) params.set("group-by", group_by);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  try {
    const res = await fetch(`${backendUrl}/analytics/appointments${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AppointmentAnalyticsResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getSalesAnalytics({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams): Promise<SalesAnalyticsResponse> {

  const params = new URLSearchParams();

  if (branch) params.set("branch", branch);
  if (group_by) params.set("group-by", group_by);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  try {
    const res = await fetch(`${backendUrl}/analytics/sales${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: SalesAnalyticsResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}
