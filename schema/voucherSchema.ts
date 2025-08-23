import { z } from "zod";

export const voucherFormSchema = z.object({
    discount_type: z
    .string()
    .min(1, "Discount type is required"),
    discount_amount: z.number().default(1),
    minimum_spend: z.number().optional(),
    quantity: z.number().min(1, "Quantity is required").default(1),
    validFrom: z.date(),
    validUntil: z.date()
})

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;
