import { ReactNode } from "react";

export type Appointment = {
  appointment_id: string;
  customer_name_snapshot: string;
  aesthetician_name_snapshot: string;
  category_snapshot:string,
  is_pro_snapshot: boolean;
  phone_number: string;
  service_name_snapshot: string;
  price_snapshot: number;
  is_sale_snapshot: boolean;
  discount_type_snapshot: string
  discount_snapshot: number
  discounted_price_snapshot: number
  branch_name_snapshot: string;
  appduration:string,
  start_time:string
  voucher_code_snapshot: string | null;
  voucher_discount_type_snapshot: string | null;
  voucher_discount_amount_snapshot: number | null;
  status: string;
  branch_rating: number | null;
  service_rating: number | null;
  aesthetician_rating: number | null;
  service_comment: string | null;
  branch_comment: string | null;
  aesthetician_comment: string | null;
  down_payment_method: string | null;
  down_payment: number | null;
  final_payment_method: string | null;
  to_pay: number;
  payment_status: string;
  created_at: string; 
  updated_at: string;
};


export type AppointmentListResponse = {
  appointment: Appointment[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
};

export type AppointmentResponse = {
  appointment: Appointment[];
  message: string;
  status: boolean;
  invoice_url?: string;
};

export type GetAppointmentParams = {
  query?: string;
  page?: number;
  limit?: number;
  branch?: string;
  date?: string;
  status?:string
  token:string
};

export type GetReviewsParams = {
  service_id?:string
  branch_id?:string
  aesthetician_id?:string
};

export interface Review {
  customer_name:string,
  customer_image:string
  service_rating: number | null;
  branch_rating: number | null;
  aesthetician_rating: number | null;
  service_comment: string | null;
  branch_comment: string | null;
  aesthetician_comment: string | null;
}

export interface ReviewResponse {
  status: boolean;
  message: string;
  review: Review[];
}


export interface AppointmentFormProps {
  renderDialog?: boolean;
  method: "post" | "patch";
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  formTitle: string;
  formDescription: string;
  appointmentId?: string;
  branchId?: string;
  serviceId?: string;
  aestheticianId?: string;
  duration:string,
  start_time:string
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  phoneNumber?: string;
  sex?: "male" | "female" | "others" | string;
  finalPaymentMethod?: "cash" | "xendit" | string;
  toPay?: number;
  voucherCode?:string
}
