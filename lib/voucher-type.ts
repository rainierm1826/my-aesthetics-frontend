export type Voucher = {
  voucher_code: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  minimum_spend: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  valid_from: string;
  valid_until: string;
};

export type VoucherResponse = {
  voucher: Voucher;
  status: boolean;
  message: string;
};

export type VoucherListResponse = {
  voucher: Voucher[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
};

export type GetVoucherParams = {
  query?: string;
  page?: number;
  limit?: number;
  discountType: string;
};
