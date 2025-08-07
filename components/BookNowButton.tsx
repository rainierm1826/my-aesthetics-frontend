"use client";

import React from "react";
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
import { useRouter } from "next/navigation";

const BookNowButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>Book Now</Button>
      </DialogTrigger>
      <DialogContent className="grid grid-cols-2" style={{ maxWidth: "800px" }}>
        <div></div>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription className="mb-5">
            Enter your credentials
          </DialogDescription>
          <SignInForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const SignInForm = () => {
  const router = useRouter();

  return (
    <div>
      <form action="">
        {/* email */}
        <div className="mb-5">
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input placeholder="Enter your email" id="email" type="email" />
        </div>

        {/* password */}
        <div className="">
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            placeholder="Enter your password"
            id="password"
            type="password"
          />
          <p className="text-xs text-right text-blue-400 mt-1">
            Forgot Password?
          </p>
        </div>
        <Button
          className="w-full mt-5"
          type="button"
          onClick={() => router.push("/owner/dashboard/appointments")}
        >
          Sign-In
        </Button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <Separator className="flex-1" />{" "}
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

export default BookNowButton;
