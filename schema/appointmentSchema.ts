import { z } from "zod";

export const walkInAppointmentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_initial: z
    .string()
    .max(1, "Middle initial must be a single character"),
  phone_number: z.string(),
  sex: z.string().min(1, "Sex is required"),
  voucher_code: z.string().optional(),
  final_payment_method: z.string().min(1, "Select payment method"),
  to_pay: z.number().optional(),
  branch_id: z.string().min(1, "Branch ID is required"),
  service_id: z.string().min(1, "Service ID is required"),
  aesthetician_id: z.string().min(1, "Aesthetician ID is required"),
});

export type WalkInAppointmentFormValues = z.infer<
  typeof walkInAppointmentSchema
>;
