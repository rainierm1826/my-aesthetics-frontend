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
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
