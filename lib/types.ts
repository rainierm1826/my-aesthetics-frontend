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
  Pending = "pending"
}

export type Branch = {
  branchName: string;
  avarageRate: number;
  region: string;
  city: string;
  barangay: string;
  blk: string;
};

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
