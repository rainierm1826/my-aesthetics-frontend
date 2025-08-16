export type Address = {
  address_id?: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  lot: string;
  created_at?: string;
  updated_at?: string;
};

export type Branch = {
  branch_id: string;
  branch_name: string;
  avarage_rate: number;
  image: string;
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

export interface BranchResponse {
  branch: Branch;
  message: string;
  status: boolean;
}

export type DeleteResponse = {
  message: string;
  status: boolean;
};

export type BranchParams = {
  branch_name?: string;
  image?: string;
  address?: Address;
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
  branchId: string;
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

export enum Sex {
  Male = "male",
  Female = "female",
}

export enum Experience {
  Pro = "professional",
  Regular = "regular",
}

export enum Availability {
  Available = "available",
  Working = "working",
  OffDuty = "off-duty",
  Break = "on-break",
}

export enum AppointmentStatus {
  Cancelled = "cancelled",
  Completed = "completed",
  Waiting = "waiting",
  Pending = "pending",
}

export enum ServiceCategory {
  SemiPermanentMakeUp = "Semi-Permanent Make-Up",
  FacialAndLaserTreatments = "Facial & Laser Treatments",
  WaxingServices = "Waxing Services",
  DiodeLaserHairRemoval = "Diode Laser Hair Removal",
  Others = "Others",
}

export enum PaymentMethod {
  Cash = "cash",
  Xendit = "xendit",
}

export enum PaymentStatus {
  Completed = "completed",
  Partial = "partial",
  Pending = "pending",
}

export type Admin = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  branchName: string;
  email: string;
};

export type Aesthetician = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  branchName: string;
  sex: Sex;
  experience: Experience;
  averageRate: number;
  availability: Availability;
  phoneNumber: string;
  image: string;
};

export type Service = {
  serviceName: string;
  category: ServiceCategory;
  averageRate: number;
  branchName: string;
  originalPrice: number;
  isSale: boolean;
  finalPrice: number;
  discountPercentage: number;
  image: string;
};

export type Voucher = {
  voucherCode: string;
  discountAmount: number;
  quantity: number;
};

export type Appointment = {
  appointmentId: string;
  slotNumber: number;
  userName: string;
  branchName: string;
  serviceName: string;
  aestheticianName: string;
  paymentMethod: PaymentMethod;
  toPay: string;
  paymentStatus: PaymentStatus;
  voucherCode: string;
  appointmentStatus: AppointmentStatus;
};
