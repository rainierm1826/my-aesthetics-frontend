export interface AnalyticsSummaryResponse {
  total_appointments: number;
  total_revenue: number;
  average_service_rating: number;
  average_aesthetician_rating: number;
  average_branch_rating: number;
  avarage_overall_rating: number;
  total_service: number;
  total_branches: number;
  total_aestheticians: number;
  completion_rate: number;
  cancellation_rate: number;
  sex_count_by_aesthetician: {
    sex: string;
    count: number;
  }[];
}

export interface AppointmentAnalyticsResponse {
  appointments_overtime: {
    year?: number;
    month?: string;
    weekday?: string;
    date?: string;
    count: number;
  }[];
  appointments_by_service_category: {
    category: string;
    count: number;
  }[];
  appointments_by_service: {
    service: string;
    count: number;
  }[];
  appointments_by_aesthetician: {
    aesthetician: string;
    count: number;
  }[];
  appointments_status: {
    status: string;
    count: number;
  }[];
  top_rated_aesthetician: {
    aesthetician: string;
    average_rate: number;
  }[];
  top_rated_service: {
    service_name: string;
    average_rate: number;
  }[];
  top_rated_branch: {
    branch_name: string;
    average_rate: number;
  }[];
}

export interface SalesAnalyticsResponse {
  revenue_overtime: {
    year?: number;
    month?: string;
    weekday?: string;
    date?: string;
    revenue: number;
  }[];
  revenue_by_aesthetician: {
    aesthetician: string;
    revenue: number;
  }[];
  revenue_by_service: {
    service: string;
    revenue: number;
  }[];
  revenue_by_category: {
    category_snapshot: string;
    revenue: number;
  }[];
  revenue_by_branch: {
    branch: string;
    revenue: number;
  }[];
  payment_popularity: {
    final_payment_method: string;
    count: number;
  }[];
}

export type GetAnalyticsParams = {
  branch?: string;
  group_by?: string;
  month?: string;
  year?: string;
};
