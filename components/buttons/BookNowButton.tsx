"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignInForm from "../forms/SignInForm";
import ForgotPasswordForm from "../forms/ForgotPasswordForm";
import Image from "next/image";
import { useAuthStore } from "@/provider/store/authStore";

const BookNowButton = ({ size, title="Sign-In" }: { size: string, title?:string }) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {isAuth} = useAuthStore()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className={`${size} ${isAuth ? "hidden" : ""} bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] text-white font-semibold hover:opacity-90 transition-opacity`}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 overflow-hidden"
        style={{ maxWidth: "800px" }}
      >
        {/* image */}
        <div className="hidden md:block relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5">
          <Image
            src="/signInImage.png"
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
              {showForgotPassword ? "Forgot Password?" : "Sign In"}
            </DialogTitle>
            <DialogDescription>
              {showForgotPassword
                ? "Reset your password"
                : "Enter your credentials to continue"}
            </DialogDescription>
          </DialogHeader>
          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : (
            <SignInForm onForgotPassword={() => setShowForgotPassword(true)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookNowButton;