"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
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
import { Mail, Clock, RefreshCw } from "lucide-react";
import { verifyOTPForgotPassword, forgotPassword } from "@/api/auth";
import { useBaseMutation } from "@/hooks/useBaseMutation";

// OTP validation schema for forgot password
const forgotPasswordOTPSchema = z.object({
  otp_code: z.string().length(6, "OTP must be 6 digits"),
});

type ForgotPasswordOTPFormValues = z.infer<typeof forgotPasswordOTPSchema>;

type ForgotPasswordOTPFormProps = {
  email: string;
  onOTPSubmit: (otp: string) => void;
  onBackClick: () => void;
};

const ForgotPasswordOTPForm = ({
  email,
  onOTPSubmit,
  onBackClick,
}: ForgotPasswordOTPFormProps) => {
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<ForgotPasswordOTPFormValues>({
    resolver: zodResolver(forgotPasswordOTPSchema),
    defaultValues: {
      otp_code: "",
    },
  });

  const { control, handleSubmit } = form;

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

  const otpMutation = useBaseMutation("post", {
    queryKey: "auth",
    createFn: verifyOTPForgotPassword,
    onSuccess: () => {
      onOTPSubmit(form.getValues("otp_code"));
    },
    successMessages: {
      create: "OTP verified successfully",
    },
  });

  const resendMutation = useBaseMutation("post", {
    queryKey: "auth",
    createFn: forgotPassword,
    onSuccess: () => {
      setCountdown(300);
      setCanResend(false);
    },
    successMessages: {
      create: "OTP sent again successfully",
    },
  });

  const onSubmit = (values: ForgotPasswordOTPFormValues) => {
    otpMutation.mutate({ email, otp_code: values.otp_code });
  };

  const handleResend = () => {
    resendMutation.mutate({ email });
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-1">We've sent a 6-digit verification code to</p>
        <p className="font-semibold text-gray-900">{email}</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="otp_code"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium text-gray-700 block text-center">
                  Enter Verification Code
                </FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field}>
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
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="text-center space-y-3">
            {!canResend ? (
              <div>
                <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4 mr-2" />
                  Resend code in {formatTime(countdown)}
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={otpMutation.isPending}
                >
                  {otpMutation.isPending ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                  className="flex items-center justify-center w-12 hover:bg-gray-100 border border-gray-200"
                >
                  <RefreshCw className={`w-4 h-4 ${resendMutation.isPending ? "animate-spin" : ""}`} />
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={otpMutation.isPending}
                >
                  {otpMutation.isPending ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBackClick}
            disabled={otpMutation.isPending || resendMutation.isPending}
          >
            Back
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the code? Check your spam folder.
        </p>
      </div>
    </>
  );
};

export default ForgotPasswordOTPForm;
