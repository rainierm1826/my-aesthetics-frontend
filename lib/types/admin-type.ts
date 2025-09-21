import { ReactNode } from "react";
import { BranchName } from "./branch-types";

export type Admin = {
  user_id: string;
  auth: {
    account_id: string;
    email: string;
  };
  branch: BranchName;
  first_name: string;
  last_name: string;
  middle_initial: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type GetAdminParams = {
  query?: string;
  page?: number;
  limit?: number;
  branch?: string;
  token:string
};

export type AdminResponse = {
  user: Admin[];
  status: boolean;
  message: string;
};

export type AdminListResposne = {
  admin: Admin[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
};

export interface AdminFormProps {
  renderDialog?: boolean;
  method: "post" | "patch";
  formTitle: string;
  formDescription: string;
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  password?: string;
  branchId?: string;
  adminId?: string;
}
