import { BranchName } from "./branch-types";

export type Admin = {
  admin_id: string;
  account_id: string;
  branch: BranchName;
  first_name: string;
  last_name: string;
  middle_initial: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminResponse = {
  admin: Admin[];
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
