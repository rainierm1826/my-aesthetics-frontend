import { z } from "zod";

export const otpFormSchema = z.object({
  otp_code: z.string().min(6).max(6),
});

export type OTPFormSchema = z.infer<typeof otpFormSchema>;
