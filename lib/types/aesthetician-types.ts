import { ReactNode } from "react";
import { BranchName } from "./branch-types";

export type GetAestheticianParams = {
  query?: string;
  page?: number;
  limit?: number;
  availability?: "available" | "working" | "off-duty" | "on-break" | string;
  sex?: "male" | "female" | "other" | string;
  branch?: string;
  experience?: "pro" | "regular" | string;
  sort?: string
};

export type Aesthetician = {
  aesthetician_id: string;
  branch: BranchName;
  first_name: string;
  last_name: string;
  middle_initial: string;
  phone_number: string;
  sex: "male" | "female" | "other" | string;
  experience: "pro" | "regular";
  availability: "available" | "working" | "off-duty" | "on-break";
  average_rate: number;
  image: string;
  created_at: string;
  updated_at: string;
};

export interface AestheticianResponse {
  aesthetician: Aesthetician;
  message: string;
  status: boolean;
}

export interface AestheticianListResponse {
  aesthetician: Aesthetician[];
  has_next: boolean;
  has_prev: boolean;
  message: string;
  pages: number;
  status: boolean;
  total: number;
}

export type InitialAestheticianProps = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  phoneNumber: string;
  experience: string;
  sex: string;
  branchId: string;
  availability: string;
  image: File | null | string;
};

export interface FormAesthetician {
  renderDialog?: boolean;
  method: "post" | "patch";
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  formTitle: string;
  formDescription: string;
  aestheticianId?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  phoneNumber?: string;
  experience?: string;
  sex?: string;
  branchId?: string;
  image?: string;
  availability?: string;
}

export type AestheticianCardProps = {
  action?: boolean;
  image: string;
  experience: "pro" | "regular" | string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  rating: number;
  availability: "available" | "working" | "off-duty" | "on-break" | string;
  aesthetician_id:string
};

export type AestheticianName = {
  first_name: string;
  last_name: string;
  middle_initial: string;
  aesthetician_id: string;
  experience:string
};

export interface AestheticianNameResponse {
  status: boolean;
  message: string;
  aesthetician: AestheticianName[];
}
