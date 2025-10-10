import { z } from "zod";

export const serviceFormSchema = z
  .object({
    service_name: z
      .string()
      .min(1, "Service name is required")
      .max(100, "Service name must be less than 100 characters"),

    image: z
      .any()
      .refine(
        (file) => file !== null && file !== undefined,
        "Image is required"
      )
      .refine(
        (file) => file instanceof File || typeof file === "string",
        "Invalid file type"
      ),

    price: z.number().min(1, "Price is required"),
    discount: z.number().optional(),
    discount_type: z.string().optional(),
    duration: z.number().min(1, "Duration is required"),
    branch_id: z.string().min(1, "Branch is required"),
    category: z.string().min(1, "Service category is required"),
    description: z.string().min(1, "Service description is required"),

    is_sale: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discount_type === "fixed" && typeof data.discount === "number") {
        return data.discount <= data.price;
      }
      return true;
    },
    {
      message: "Discount cannot be greater than price",
      path: ["discount"],
    }
  );

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
