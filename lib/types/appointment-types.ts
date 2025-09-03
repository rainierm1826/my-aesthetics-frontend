export type Appointment = {
  appointment_id: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
  } | null;
  walk_in: {
    walk_in_id: string;
    first_name: string;
    last_name: string;
    middle_initial: string;
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
    experience: number;
  };
  service: {
    service_id: string;
    service_name: string;
    final_price: number;
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
