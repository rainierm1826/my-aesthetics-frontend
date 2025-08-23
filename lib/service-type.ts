import { ReactNode } from "react";

export interface ServiceFormProps {
  renderDialog?: boolean;
  method: "post" | "patch";
  buttonLabel: string;
  dialogButtonLabel: string | ReactNode;
  formTitle: string;
  formDescription?: string;
  serviceName?: string;
  description?: string;
  branchId?: string | null;
  serviceId?: string;
  price?: number;
  discount?: number;
  discountType?: string;
  priceDiscounted?: number;
  category?: string;
  isOnSale?: boolean;
  image?: string;
}