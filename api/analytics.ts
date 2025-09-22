import { apiRequest, buildParams } from "@/lib/function";
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

export async function getAppointmentSummary({
  branch,
  group_by,
  month,
  year,
  token,
}: GetAnalyticsParams): Promise<AppointmentSummaryResponse> {
  const params = buildParams({ branch, group_by, month, year, token });
  return apiRequest<AppointmentSummaryResponse>(
    `/analytics/appointment/summary?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function getSalesSummary({
  branch,
  group_by,
  month,
  year,
  token,
}: GetAnalyticsParams): Promise<SalesSummaryResponse> {
  const params = buildParams({ branch, group_by, month, year, token });
  return apiRequest<SalesSummaryResponse>(
    `/analytics/sales/summary?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function getBranchSummary(
  token: string
): Promise<BranchAnalyticsResponse> {
  return apiRequest<BranchAnalyticsResponse>(`/analytics/branch`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAestheticianSummary(
  token: string
): Promise<AestheticianAnalyticsResponse> {
  return apiRequest<AestheticianAnalyticsResponse>(`/analytics/aesthetician`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getServiceSummary(
  token: string
): Promise<ServiceAnalyticsResponse> {
  return apiRequest<ServiceAnalyticsResponse>(`/analytics/service`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAppointmentsSummary(
  token: string
): Promise<AppointmentsAnalyticsResponse> {
  return apiRequest<AppointmentsAnalyticsResponse>(`/analytics/appointment`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAppointmentAnalytics({
  branch,
  group_by,
  month,
  year,
  token,
}: GetAnalyticsParams): Promise<AppointmentAnalyticsResponse> {
  const params = buildParams({ branch, group_by, month, year });
  return apiRequest<AppointmentAnalyticsResponse>(
    `/analytics/appointments?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function getSalesAnalytics({
  branch,
  group_by,
  month,
  year,
  token,
}: GetAnalyticsParams): Promise<SalesAnalyticsResponse> {
  const params = buildParams({ branch, group_by, month, year });
  return apiRequest<SalesAnalyticsResponse>(`/analytics/sales?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
