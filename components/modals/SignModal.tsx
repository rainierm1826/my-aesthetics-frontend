"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import SignInForm from "../forms/SignInForm";
import SignUpForm from "../forms/SignUpForm";
import OTPForm from "../forms/OTPForm";
import ForgotPasswordForm from "../forms/ForgotPasswordForm";
import { useSignModalContext } from "./SignModalContext";

const SignModal = () => {
  const { open, setOpen, showSignUp, setShowSignUp } = useSignModalContext();
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showOTP, setShowOTP] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 overflow-hidden"
        style={{ maxWidth: "800px" }}
      >
        {/* image */}
        <div className="hidden md:block relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5">
          <Image
            src={showSignUp ? "/signUpImage.png" : "/signInImage.png"}
            alt="Professional brow styling service"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        {/* form section */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl">
              {showForgotPassword
                ? "Forgot Password?"
                : showSignUp
                ? "Sign Up"
                : showOTP
                ? "Verify OTP"
                : "Sign In"}
            </DialogTitle>
            <DialogDescription>
              {showForgotPassword
                ? "Reset your password"
                : showSignUp
                ? "Enter your credentials to continue"
                : showOTP
                ? "Enter the OTP sent to your email"
                : "Enter your credentials to continue"}
            </DialogDescription>
          </DialogHeader>
          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : showSignUp ? (
            showOTP ? (
              <OTPForm onBack={() => setShowOTP(false)} />
            ) : (
              <SignUpForm
                onContinue={() => setShowOTP(true)}
                onSwitchToSignIn={() => {
                  setShowSignUp(false);
                  setShowOTP(false);
                }}
              />
            )
          ) : (
            <SignInForm
              onForgotPassword={() => setShowForgotPassword(true)}
              onSwitchToSignUp={() => {
                setShowSignUp(true);
                setShowOTP(false);
                setShowForgotPassword(false);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignModal;