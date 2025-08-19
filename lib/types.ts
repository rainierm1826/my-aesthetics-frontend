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


export type DeleteResponse = {
  message: string;
  status: boolean;
};


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

export interface DropDownProps {
  onValueChange?: (value: string) => void;
  value: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
}