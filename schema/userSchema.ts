import { z } from "zod";

export const userFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "First name must be less than 100 characters"),
  middle_initial: z.string().max(1, "Maximum of one character"),
  image: z
    .any()
    .refine(
      (file) => !file || file instanceof File || typeof file === "string",
      "Invalid file type"
    ),
  birthday: z.date().min(1, "Birthday is required").max(Date.now()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  phone_number: z.string().min(1, "Phone number is required"),
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

export type UserFormValues = z.infer<typeof userFormSchema>;
