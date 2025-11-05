import { z } from "zod";

export const branchFormSchema = z.object({
  branch_name: z
    .string()
    .min(1, "Branch name is required")
    .max(100, "Branch name must be less than 100 characters"),
  image: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Image is required"),
  address: z.object({
    region: z
      .string()
      .min(1, "Region is required")
      .max(50, "Region must be less than 50 characters"),

    province: z
      .string()
      .min(1, "Province is required")
      .max(50, "Province must be less than 50 characters"),

    city: z
      .string()
      .min(1, "City is required")
      .max(50, "City must be less than 50 characters"),

    barangay: z
      .string()
      .min(1, "Barangay is required")
      .max(50, "Barangay must be less than 50 characters"),

    lot: z
      .string()
      .min(1, "Street address is required")
      .max(100, "Street address must be less than 100 characters"),
  }),
  slot_capacity: z
    .number()
    .min(1, "Slot capacity must be at least 1")
    .max(999, "Slot capacity must be less than 1000"),
  opening_time: z
    .string()
    .min(1, "Opening time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  closing_time: z
    .string()
    .min(1, "Closing time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
