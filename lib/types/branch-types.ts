import { Address, DeleteResponse } from "./types";

export type Branch = {
  branch_id: string;
  branch_name: string;
  avarage_rate: number;
  image: string;
  status: "active" | "close";
  address: Address;
  created_at?: string;
  updated_at?: string;
};

export interface BranchListResponse {
  branch: Branch[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
}

export type BranchName = {
  branch_name: string;
  branch_id: string;
};

export interface BranchNameResponse {
  status: boolean;
  message: string;
  branch: BranchName[];
}

export interface BranchResponse {
  branch: Branch;
  message: string;
  status: boolean;
}

export type GetBranchesParams = {
  query?: string;
  page?: number;
  limit?: number;
};

export type BranchFormState = {
  branch_name: string;
  image: File | string | null;
  address: {
    region: string;
    province: string;
    city: string;
    barangay: string;
    lot: string;
  };
};

export interface BranchFormProps {
  deleteFn?: (id: string) => Promise<DeleteResponse>;
  renderDialog?: boolean;
  method: "post" | "patch";
  formTitle: string;
  formDescription: string;
  branchId?: string;
  branchName?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  lot?: string;
  image?: string;
  buttonLabel: string;
  dialogButtonLabel?: string | React.ReactNode;
}

export type BranchCardProps = {
  branch_id:string
  className?: string;
  image: string;
  branchName: string;
  status: string;
  rating: number;
  barangay: string;
  province: string;
  city: string;
  lot: string;
  action?: boolean;
}
