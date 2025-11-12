import { apiRequest, buildParams } from "@/lib/function";

export interface CustomerSummaryResponse {
  total_customers: number;
  active_customers: number;
  customer_retention_rate: number;
  average_customer_lifetime_value: number;
}

export interface CustomerDetail {
  customer: {
    id: string;
    name: string;
    type: string;
    phone: string;
    joined_date: string;
  };
  stats: {
    total_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    total_spent: number;
    average_transaction: number;
    days_since_last_appointment: number | null;
  };
  preferences: {
    favorite_services: Array<{ service: string; count: number }>;
    favorite_aestheticians: Array<{ aesthetician: string; count: number }>;
    favorite_branches: Array<{ branch: string; count: number }>;
  };
  appointment_history: Array<{
    appointment_id: string;
    start_time: string;
    status: string;
    service_name_snapshot: string;
    aesthetician_name_snapshot: string;
    to_pay: number;
  }>;
}

export interface SpendingData {
  service: string;
  appointment_count: number;
  total_spent: number;
  average_spent: number;
}

export interface TimelineData {
  appointment_id: string;
  start_time: string;
  status: string;
  service_name_snapshot: string;
  aesthetician_name_snapshot: string;
  branch_name_snapshot: string;
  to_pay: number;
  payment_status: string;
}

export interface CustomerDetailResponse {
  status: boolean;
  customer: CustomerDetail["customer"];
  stats: CustomerDetail["stats"];
  preferences: CustomerDetail["preferences"];
  appointment_history: CustomerDetail["appointment_history"];
}

export interface SpendingResponse {
  status: boolean;
  spending: SpendingData[];
}

export interface TimelineResponse {
  status: boolean;
  appointments: TimelineData[];
}

export async function getCustomerDetail(
  customerId: string,
  customerType: "online" | "walkin",
  token: string
): Promise<CustomerDetailResponse> {
  const params = buildParams({
    customer_id: customerId,
    type: customerType,
  });

  return apiRequest<CustomerDetailResponse>(`/customer/detail?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCustomerSpendingByService(
  customerId: string,
  customerType: "online" | "walkin",
  token: string
): Promise<SpendingResponse> {
  const params = buildParams({
    customer_id: customerId,
    type: customerType,
  });

  return apiRequest<SpendingResponse>(
    `/customer/spending-by-service?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function getCustomerTimeline(
  customerId: string,
  customerType: "online" | "walkin",
  token: string
): Promise<TimelineResponse> {
  const params = buildParams({
    customer_id: customerId,
    type: customerType,
  });

  return apiRequest<TimelineResponse>(`/customer/timeline?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCustomerSummary(
  token: string
): Promise<CustomerSummaryResponse> {
  return apiRequest<CustomerSummaryResponse>(`/customer/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
