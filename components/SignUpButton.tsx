"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "@/components/ui/separator";
import FacebookLogo from "@/public/facebook-svgrepo-com.svg";
import GoogleLogo from "@/public/google-color-svgrepo-com.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const SignUpButton = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign-Up</Button>
      </DialogTrigger>
      <DialogContent
        className="grid grid-cols-2 min-h-[500px] "
        style={{ maxWidth: "800px" }}
      >
        {/* left column for image */}
        <div></div>

        {/* right column for forms */}
        <div
          className={`${
            toggle ? "" : "flex justify-center items-center flex-col"
          }`}
        >
          <DialogHeader>
            <DialogTitle>{toggle ? "Sign Up" : "Enter OTP"}</DialogTitle>
            <DialogDescription className="mb-5">
              {toggle
                ? "Enter your credentials"
                : "We have sent a 6-digit code to your email"}
            </DialogDescription>
          </DialogHeader>

          {toggle ? (
            <SignUpForm onContinue={() => setToggle(false)} />
          ) : (
            <OtpForm />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SignUpFormProps {
  onContinue: () => void;
}

const SignUpForm = ({ onContinue }: SignUpFormProps) => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        {/* email */}
        <div className="mb-5">
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input placeholder="Enter your email" id="email" type="email" />
        </div>

        {/* password */}
        <div className="mb-5">
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            placeholder="Enter your password"
            id="password"
            type="password"
          />
        </div>

        {/* confirm password */}
        <div>
          <Label className="mb-2" htmlFor="c-password">
            Confirm Password
          </Label>
          <Input
            placeholder="Confirm your password"
            id="c-password"
            type="password"
          />
        </div>

        <Button className="w-full mt-5" type="submit">
          Continue
        </Button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <Separator className="flex-1" />
        <p className="text-xs text-[#7C7C7C]">or</p>
        <Separator className="flex-1" />
      </div>
      <p className="text-sm text-center mb-1">Sign In With</p>
      <div className="flex gap-3 justify-center">
        <FacebookLogo className="w-6 h-6" />
        <GoogleLogo className="w-6 h-6" />
      </div>
    </div>
  );
};

const OtpForm = () => {
  return (
    <div className="w-full">
      <form className="flex flex-col justify-center items-center">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button className="w-full mt-5" type="submit">
          Verify
        </Button>
      </form>
    </div>
  );
};

export default SignUpButton;
