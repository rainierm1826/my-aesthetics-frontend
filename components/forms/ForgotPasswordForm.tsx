"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
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
import { z } from "zod";
import ForgotPasswordOTPForm from "./ForgotPasswordOTPForm";
import { forgotPassword, resetPassword } from "@/api/auth";
import { useBaseMutation } from "@/hooks/useBaseMutation";

// Email validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// New password validation schema
const newPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

type ForgotPasswordFormProps = {
  onBack: () => void;
};

// Step 1: Email Form
const EmailStep = ({
  onEmailSubmit,
  onBackClick,
}: {
  onEmailSubmit: (email: string) => void;
  onBackClick: () => void;
}) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { control, handleSubmit } = form;

  const emailMutation = useBaseMutation("post", {
    queryKey: "auth",
    createFn: forgotPassword,
    onSuccess: () => {
      const email = form.getValues("email");
      onEmailSubmit(email);
    },
    successMessages: {
      create: "OTP sent to your email",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    emailMutation.mutate(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="forgot-email" className="text-xs text-gray-600">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id="forgot-email"
                    placeholder="Enter email"
                    type="email"
                    disabled={emailMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
           
            <Button
              className="flex-1"
              variant="outline"
              type="button"
              onClick={onBackClick}
              disabled={emailMutation.isPending}
            >
              Back
            </Button>
             <Button className="flex-1" type="submit" disabled={emailMutation.isPending}>
              {emailMutation.isPending ? "Sending..." : "Send Code"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

// Step 2: OTP Verification Form - uses dedicated component
const OTPStep = ({
  email,
  onOTPSubmit,
  onBackClick,
}: {
  email: string;
  onOTPSubmit: (otp: string) => void;
  onBackClick: () => void;
}) => {
  return (
    <ForgotPasswordOTPForm
      email={email}
      onOTPSubmit={onOTPSubmit}
      onBackClick={onBackClick}
    />
  );
};

// Step 3: New Password Form
const NewPasswordStep = ({
  email,
  onPasswordSubmit,
  onBackClick,
}: {
  email: string;
  otp: string;
  onPasswordSubmit: () => void;
  onBackClick: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const { control, handleSubmit } = form;

  const passwordMutation = useBaseMutation("post", {
    queryKey: "auth",
    createFn: resetPassword,
    onSuccess: () => {
      onPasswordSubmit();
    },
    successMessages: {
      create: "Password reset successfully",
    },
  });

  const onSubmit = (values: NewPasswordFormValues) => {
    passwordMutation.mutate({
      email,
      new_password: values.new_password,
    });
  };

  return (
    <>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="new-password" className="text-xs text-gray-600">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="new-password"
                      placeholder="Enter new password"
                      type={showPassword ? "text" : "password"}
                      disabled={passwordMutation.isPending}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="confirm-password" className="text-xs text-gray-600">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      placeholder="Confirm new password"
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={passwordMutation.isPending}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            
            <Button
              className="flex-1"
              variant="outline"
              type="button"
              onClick={onBackClick}
              disabled={passwordMutation.isPending}
            >
              Back
            </Button>
            <Button 
              className="flex-1" 
              type="submit"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

// Success Step
const SuccessStep = ({
  onSignInClick,
}: {
  onSignInClick: () => void;
}) => {
  return (
    <>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold mb-2">Password Reset Successful</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Button className="w-full" onClick={onSignInClick}>
          Back to Sign In
        </Button>
      </div>
    </>
  );
};

// Main Component
const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div>
      {step === "email" && (
        <EmailStep
          onEmailSubmit={(submittedEmail) => {
            setEmail(submittedEmail);
            setStep("otp");
          }}
          onBackClick={onBack}
        />
      )}

      {step === "otp" && (
        <OTPStep
          email={email}
          onOTPSubmit={(submittedOtp) => {
            setOtp(submittedOtp);
            setStep("password");
          }}
          onBackClick={() => setStep("email")}
        />
      )}

      {step === "password" && (
        <NewPasswordStep
          email={email}
          otp={otp}
          onPasswordSubmit={() => setStep("success")}
          onBackClick={() => setStep("otp")}
        />
      )}

      {step === "success" && (
        <SuccessStep onSignInClick={onBack} />
      )}
    </div>
  );
};

export default ForgotPasswordForm;
