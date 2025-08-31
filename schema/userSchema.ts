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
  birthday: z
    .string()
    .min(1, "Birthday is required")
    .max(Date.now())
    .or(z.literal("")),
  email: z.email().readonly(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .optional()
    .or(z.literal("")),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .optional()
    .or(z.literal("")),
  role: z.string().readonly(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
