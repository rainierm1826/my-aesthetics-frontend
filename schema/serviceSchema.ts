import { z } from "zod";


export const serviceFormSchema = z.object({
  service_name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be less than 100 characters"),

  image: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Image is required")
    .refine(
      (file) => file instanceof File || typeof file === "string",
      "Invalid file type"
    ),

  price: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().min(0, "Price must be at least 0")
  ),
  discount_percentage: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().min(0).max(100)
  ),

  branch_id: z.string().min(1, "Branch is required"),

  category: z.string().min(1, "Service category is required"),

  description: z
    .string()
    .min(1, "Service description is required")
    .max(255, "Service description must be 255 characters or less"),

  is_sale: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
