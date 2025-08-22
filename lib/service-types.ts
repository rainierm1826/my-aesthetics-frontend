export type Service = {
  service_id: string;
  branch_id: string | null;
  branch: {
    branch_name: string | null;
  };
  service_name: string;
  original_price: number;
  final_price: number;
  is_sale: boolean;
  discount_percentage: number;
  category: string;
  image: string;
  avarage_rate: number;
  created_at: string;
  updated_at: string;
};

export type ServiceResponse = {
  service: Service[];
  status: boolean;
  message: string;
};

export type ServiceListResponse = {
  service: Service[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
};

export type GetServiceParams = {
  query?: string;
  page?: number;
  limit?: number;
};