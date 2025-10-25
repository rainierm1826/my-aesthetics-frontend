"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useAuthStore } from "@/provider/store/authStore";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { sendEmailVerificationOTP, verifyEmailOTP } from "@/api/auth";
import { Mail, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type EmailVerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess?: () => void;
};

type VerificationStep = "email" | "otp" | "success";

// Reuse same OTP schema
const otpSchema = z.object({
  otp_code: z.string().length(6, "OTP must be 6 digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const EmailVerificationModal = ({
  isOpen,
  onClose,
  onVerificationSuccess,
}: EmailVerificationModalProps) => {
  const { auth, setAuth, access_token } = useAuthStore();
  const [step, setStep] = useState<VerificationStep>("email");
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: "",
    },
  });

  const { control, handleSubmit, reset, getValues } = form;

  // Check if user is admin or owner
  const isAdminOrOwner =
    auth?.role === "admin" ||
    auth?.role === "owner";

  // Send OTP mutation
  const sendOTPMutation = useBaseMutation("post", {
    queryKey: "email-verification",
    createFn: sendEmailVerificationOTP,
    onSuccess: () => {
      setStep("otp");
      setCountdown(300);
      setCanResend(false);
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useBaseMutation("post", {
    queryKey: "email-verification",
    createFn: verifyEmailOTP,
    onSuccess: () => {
      // Update auth store with verified status
      if (auth) {
        setAuth(
          {
            ...auth,
            is_verified: true,
          },
          access_token
        );
      }
      setStep("success");
    },
  });

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && step === "otp") {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && step === "otp") {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown, step]);

  // Auto-send OTP when modal opens
  useEffect(() => {
    if (isOpen && step === "email") {
      handleSendOTP();
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSendOTP = () => {
    sendOTPMutation.mutate({
      email: auth?.email || "",
    } as any);
  };

  const onSubmit = (values: OTPFormValues) => {
    verifyOTPMutation.mutate({
      email: auth?.email || "",
      otp_code: values.otp_code,
    } as any);
  };

  const handleResend = () => {
    reset();
    handleSendOTP();
  };

  const handleClose = () => {
    setStep("email");
    setCountdown(300);
    setCanResend(false);
    reset();
    onClose();
  };

  const handleSuccess = () => {
    onVerificationSuccess?.();
    handleClose();
  };

  // Only show modal for admin/owner users
  if (!isAdminOrOwner) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Verify Your Email
          </DialogTitle>
          <DialogDescription>
            We need to verify your email address to ensure account security
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Step */}
          {step === "email" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  Verification code will be sent to:
                </p>
                <p className="font-medium text-gray-900 mt-1">
                  {auth?.email}
                </p>
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={sendOTPMutation.isPending}
                className="w-full"
              >
                {sendOTPMutation.isPending ? "Sending..." : "Send Verification Code"}
              </Button>
              {sendOTPMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    {(sendOTPMutation.error as any)?.message || "Failed to send verification code"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="font-medium text-gray-900">{auth?.email}</p>
                </div>

                <FormField
                  control={control}
                  name="otp_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            {...field}
                            disabled={verifyOTPMutation.isPending}
                          >
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
                      verifyOTPMutation.isPending ||
                      getValues("otp_code").length !== 6
                    }
                  >
                    {verifyOTPMutation.isPending ? "Verifying..." : "Verify Email"}
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
                      disabled={sendOTPMutation.isPending}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          sendOTPMutation.isPending ? "animate-spin" : ""
                        }`}
                      />
                      {sendOTPMutation.isPending ? "Sending..." : "Resend Code"}
                    </Button>
                  )}
                </div>

                {verifyOTPMutation.isError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">
                      {(verifyOTPMutation.error as any)?.message || "Failed to verify email"}
                    </p>
                  </div>
                )}
              </form>
            </Form>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email Verified!
                </h3>
                <p className="text-sm text-gray-600">
                  Your email has been successfully verified.
                </p>
              </div>
              <Button onClick={handleSuccess} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
