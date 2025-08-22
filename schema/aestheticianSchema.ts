import { z } from "zod";

export const aestheticianFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "First name must be less than 100 characters"),
  middle_initial: z.string().max(1, "Maximum of one character"),
  phone_number: z.string().min(1, "Phone number is required"),
  experience: z.string().min(1, "Experience is required"),
  sex: z.string().min(1, "Sex is required"),
  branch_id: z.string().min(1, "Branch is required"),
  image: z
    .any()
    .refine(
      (file) => !file || file instanceof File || typeof file === "string",
      "Invalid file type"
    ),
  availability: z.string().min(1, "Availability is required"),
});

export type AestheticianFormValues = z.infer<typeof aestheticianFormSchema>;
