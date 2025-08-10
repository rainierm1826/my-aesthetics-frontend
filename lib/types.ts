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

export enum ServiceCategory {
  SemiPermanentMakeUp = "Semi-Permanent Make-Up",
  FacialAndLaserTreatments = "Facial & Laser Treatments",
  WaxingServices = "Waxing Services",
  DiodeLaserHairRemoval = "Diode Laser Hair Removal",
  Others = "Others",
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
  
}
