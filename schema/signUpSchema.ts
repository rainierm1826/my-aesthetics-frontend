import { z } from "zod";

export const signUpFormSchema = z
  .object({
    email: z.email(),
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
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const signUpAdminFormSchema = z
  .object({
    email: z.email().optional(),
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
      .optional(),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional(),
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name must be less than 100 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(100, "First name must be less than 100 characters"),
    middle_initial: z.string().max(1, "Maximum of one character"),
    branch_id: z.string().min(1, "Branch is required"),
  })
  .refine((data) => {
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Password do not match.",
    path: ["confirmPassword"],
  });

export type SignUpAdminFormValues = z.infer<typeof signUpAdminFormSchema>;

