export interface AppointmentSummaryResponse {
  total_appointments: number;
  avarage_overall_rating: number;
  completion_rate: number;
  cancellation_rate: number;
}

export interface SalesSummaryResponse {
  total_revenue: number;
}

export interface AppointmentOvertimeItem {
  count: number;
  type: "actual" | "predicted";
  year?: string | number;
  month?: string;
  month_num?: string | number;
  weekday?: string;
  date?: string;
}

export interface AppointmentsOvertimeResponse {
  appointments_overtime: AppointmentOvertimeItem[];
}

export interface RevenueOvertimeItem {
  revenue: number;
  type: "actual" | "predicted";
  year?: string | number;
  month?: string;
  month_num?: string | number;
  weekday?: string;
  date?: string;
}

export interface RevenueOvertimeResponse {
  revenue_overtime: RevenueOvertimeItem[];
}

export interface AppointmentAnalyticsResponse {
  appointments_by_service_category: {
    category: string;
    count: number;
  }[];
  appointments_by_branch: {
    branch: string;
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
  predict?: string;
  token: string;
};

export type BranchAnalyticsResponse = {
  branch_completion_rate: Record<string, number>;
  average_branch_rating: number;
};

export type AestheticianExperience = {
  count: number;
  experience: string;
};

export type AestheticianAnalyticsResponse = {
  aesthetician_experience: AestheticianExperience[];
  average_aesthetician_rating: number;
  total_aestheticians: number;
};

export type ServiceAnalyticsResponse = {
  average_service_rating: number;
  sale_service: number;
  total_services: number;
};

type AverageServiceRating = {
  branch: string;
  daily_average: number;
};

export type AppointmentsAnalyticsResponse = {
  average_service_rating: AverageServiceRating[];
};
