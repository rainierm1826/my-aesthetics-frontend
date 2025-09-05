import { ReactNode } from "react";

export type Appointment = {
  appointment_id: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
    phone_number: string;
    sex: string;
  } | null;
  walk_in: {
    walk_in_id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
    phone_number: string;
    sex: string;
  } | null;
  branch: {
    branch_id: string;
    branch_name: string | null;
  };
  aesthetician: {
    aesthetician_id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
    experience: string;
  };
  service: {
    service_id: string;
    service_name: string;
    final_price: number;
    discounted_price:number
    category: string;
  };
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
  voucher_code: string | null;
  discount_amount: number;
  original_amount: number;
  slot_number: number;
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
};

export type GetAppointmentParams = {
  query?: string;
  page?: number;
  limit?: number;
  branch?: string;
  date?: string;
  status?:string
};

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
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  phoneNumber?: string;
  sex?: "male" | "female" | "others" | string;
  finalPaymentMethod?: "cash" | "xendit" | string;
  toPay?: number;
  voucherCode?:string
}
