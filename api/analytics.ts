import {
  AestheticianAnalyticsResponse,
  AppointmentAnalyticsResponse,
  AppointmentsAnalyticsResponse,
  AppointmentSummaryResponse,
  BranchAnalyticsResponse,
  GetAnalyticsParams,
  SalesAnalyticsResponse,
  SalesSummaryResponse,
  ServiceAnalyticsResponse,
} from "@/lib/types/analytics-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAppointmentSummary({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams): Promise<AppointmentSummaryResponse> {

  const params = new URLSearchParams();

  if (branch) params.set("branch", branch);
  if (group_by) params.set("group-by", group_by);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  try {
    const res = await fetch(`${backendUrl}/analytics/appointment/summary${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AppointmentSummaryResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getSalesSummary({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams): Promise<SalesSummaryResponse> {

  const params = new URLSearchParams();

  if (branch) params.set("branch", branch);
  if (group_by) params.set("group-by", group_by);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  try {
    const res = await fetch(`${backendUrl}/analytics/sales/summary${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: SalesSummaryResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getBranchSummary(): Promise<BranchAnalyticsResponse> {

  try {
    const res = await fetch(`${backendUrl}/analytics/branch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: BranchAnalyticsResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAestheticianSummary(): Promise<AestheticianAnalyticsResponse> {

  try {
    const res = await fetch(`${backendUrl}/analytics/aesthetician`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AestheticianAnalyticsResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getServiceSummary(): Promise<ServiceAnalyticsResponse> {

  try {
    const res = await fetch(`${backendUrl}/analytics/service`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: ServiceAnalyticsResponse = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAppointmentsSummary(): Promise<AppointmentsAnalyticsResponse> {

  try {
    const res = await fetch(`${backendUrl}/analytics/appointment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
    }

    const result: AppointmentsAnalyticsResponse = await res.json();
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
