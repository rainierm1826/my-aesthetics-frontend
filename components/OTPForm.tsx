"use client";

import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { useForm } from "react-hook-form";
import { otpFormSchema, OTPFormSchema } from "@/schema/otpSchema";
import { resendOTP, verifyOTP } from "@/api/auth";
import { Mail, Clock, RefreshCw } from "lucide-react";

type OTPFormProps = {
  onBack: () => void;
};

const OTPForm = ({ onBack }: OTPFormProps) => {
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<OTPFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp_code: "",
    },
  });

  const { control, handleSubmit, reset } = form;

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
    queryKey: "account",
    createFn: verifyOTP,
    onSuccess: () => {
      localStorage.removeItem("email");
      reset({ otp_code: "" });
      onBack();
    },
    successMessages: {
      create: "Sign Up Successfully",
    },
  });

  const resendMutation = useBaseMutation("post", {
    queryKey: "account",
    createFn: resendOTP,
    successMessages: {
      create: "OTP Sent Successfully",
    },
  });

  const isLoading = otpMutation.isPending;

  const onSubmit = async (values: OTPFormSchema) => {
    const email = localStorage.getItem("email");
    const payload = { ...values, email: email };
    otpMutation.mutate(payload);
  };

  const handleResend = () => {
    setCountdown(300);
    setCanResend(false);
    resendMutation.mutate({ email: email });
  };

  const email = localStorage.getItem("email");

  return (
    <div className="">
      <div className="">
        {/* Main Card */}
        <div className="">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {email || "your email address"}
            </p>
          </div>

          {/* Form */}
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
                      className="w-full bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] text-white"
                    >
                      {isLoading ? " Verifying..." : "Verify Code"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleResend}
                      className="flex items-center justify-center w-12 hover:bg-gray-100 border border-gray-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] text-white"
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the code? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
