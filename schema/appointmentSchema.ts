import { z } from "zod";

export const walkInAppointmentSchema = z.object({
  walk_in_id: z.string().min(1, "Walk-in Customer ID is required"),
  voucher_code: z.string().optional(),
  final_payment_method: z.string().min(1, "Select payment method"),
  branch_id: z.string().min(1, "Branch ID is required"),
  service_id: z.string().min(1, "Service ID is required"),
  aesthetician_id: z.string().min(1, "Aesthetician ID is required"),
  start_time:z.string().min(1, "Slot is required"),
  date:z.string(),
  status: z.string().optional(),
});

export type WalkInAppointmentFormValues = z.infer<
  typeof walkInAppointmentSchema
>;
