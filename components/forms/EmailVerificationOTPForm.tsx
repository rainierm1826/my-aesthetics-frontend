"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { Clock, RefreshCw } from "lucide-react";

// OTP validation schema for email verification
const emailVerificationOTPSchema = z.object({
  otp_code: z.string().length(6, "OTP must be 6 digits"),
});

type EmailVerificationOTPFormValues = z.infer<
  typeof emailVerificationOTPSchema
>;

type EmailVerificationOTPFormProps = {
  email: string;
  onOTPSubmit: (otp: string) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
};

const EmailVerificationOTPForm = ({
  email,
  onOTPSubmit,
  onResend,
  isVerifying,
  isResending,
}: EmailVerificationOTPFormProps) => {
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<EmailVerificationOTPFormValues>({
    resolver: zodResolver(emailVerificationOTPSchema),
    defaultValues: {
      otp_code: "",
    },
  });

  const { control, handleSubmit, getValues, reset } = form;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const onSubmit = (values: EmailVerificationOTPFormValues) => {
    onOTPSubmit(values.otp_code);
  };

  const handleResend = () => {
    onResend();
    setCountdown(300);
    setCanResend(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field} disabled={isVerifying}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isVerifying ||
                getValues("otp_code").length !== 6
              }
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>

            {!canResend && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Resend code in {formatTime(countdown)}</span>
              </div>
            )}

            {canResend && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? "animate-spin" : ""}`} />
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailVerificationOTPForm;
