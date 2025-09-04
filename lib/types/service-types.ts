import { ReactNode } from "react";
import { BranchName } from "./branch-types";

export interface ServiceFormProps {
  renderDialog?: boolean;
  method: "post" | "patch";
  buttonLabel: string;
  dialogButtonLabel: string | ReactNode;
  formTitle: string;
  formDescription?: string;
  serviceName?: string;
  description?: string;
  branchId?: string | null;
  serviceId?: string;
  price?: number;
  discount?: number;
  discountType?: string;
  priceDiscounted?: number;
  category?: string;
  isOnSale?: boolean;
  image?: string;
}

export type Service = {
  service_id: string;
  branch_id: string | null;
  branch: BranchName
  service_name: string;
  price: number;
  final_price: number;
  description: string;
  is_sale: boolean;
  discount_type: "fixed" | "percentage" | string;
  discount: number;
  discounted_price: number;
  category: string;
  image: string;
  average_rate: number;
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
  branch?:string
  category?:string
};

export type ServiceName = {
  service_name: string;
  service_id: string;
};

export interface ServiceNameResponse {
  status: boolean;
  message: string;
  service: ServiceName[];
}