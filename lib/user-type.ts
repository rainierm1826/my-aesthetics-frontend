import { User } from "lucide-react";
import { BranchName } from "./branch-types";

export type User = {
  user_id: string;
  account_id: string;
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  branch?: BranchName
  birthday: string | null;
  age: number | null;
  image: string | null;
  phone_number: string | null
  created_at: string;
  updated_at: string;
};

export interface UserResponse {
  user: User;
  status: boolean;
  message: string;
}
