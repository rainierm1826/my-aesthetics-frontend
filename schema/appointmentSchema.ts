import { z } from "zod";

export const appointmentServiceSchema = z.object({
  service_id: z.string().min(1, "Service ID is required"),
  aesthetician_id: z.string().min(1, "Aesthetician ID is required"),
  start_time: z.string().min(1, "Slot is required"),
});

export const walkInAppointmentSchema = z.object({
  walk_in_id: z.string().min(1, "Walk-in Customer ID is required"),
  voucher_code: z.string().optional(),
  final_payment_method: z.string().min(1, "Select payment method"),
  branch_id: z.string().min(1, "Branch ID is required"),
  date: z.string(),
  status: z.string().optional(),
  services: z.array(appointmentServiceSchema).min(1, "At least one service is required"),
});

export type WalkInAppointmentFormValues = z.infer<typeof walkInAppointmentSchema>;
