import { z } from "zod";

export const voucherFormSchema = z.object({
    discount_type: z
    .string()
    .min(1, "Discount type is required"),
    discount_amount: z.number(),
    minimum_spend: z.number().optional(),
    quantity: z.number().min(1, "Quantity is required"),
    valid_from: z.string().min(1, "Select a valid date."),
    valid_until: z.string().min(1, "Select a valid date.")
})

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;
