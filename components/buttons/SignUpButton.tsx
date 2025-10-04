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

import SignUpForm from "../forms/SignUpForm";
import OTPForm from "../forms/OTPForm";
import Image from "next/image";

const SignUpButton = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign-Up</Button>
      </DialogTrigger>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 overflow-hidden"
        style={{ maxWidth: "800px" }}
      >
        {/* image */}
        <div className="hidden md:block relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5">
          <Image
            src="/signUpImage.png"
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
              {toggle ? "Sign Up" : ""}
            </DialogTitle>
            <DialogDescription>
              {toggle ? "Enter your credentials to continue" : ""}
            </DialogDescription>
          </DialogHeader>

          {toggle ? (
            <SignUpForm onContinue={() => setToggle(false)} />
          ) : (
            <OTPForm onBack={() => setToggle(true)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpButton;
