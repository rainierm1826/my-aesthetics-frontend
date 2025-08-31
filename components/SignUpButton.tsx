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

import SignUpForm from "./SignUpForm";
import OTPForm from "./OTPForm";

const SignUpButton = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign-Up</Button>
      </DialogTrigger>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] "
        style={{ maxWidth: "800px" }}
      >
        {/* left column for image */}
        <div className="hidden md:flex"></div>

        {/* right column for forms */}
        <div
          className={`${
            toggle ? "" : "flex justify-center items-center flex-col"
          }`}
        >
          <DialogHeader>
            <DialogTitle>{toggle ? "Sign Up" : ""}</DialogTitle>
            <DialogDescription className="mb-5">
              {toggle
                ? "Enter your credentials"
                : ""}
            </DialogDescription>
          </DialogHeader>

          {toggle ? (
            <SignUpForm onContinue={() => setToggle(false)} />
          ) : (
            <OTPForm onBack={() => setToggle(true)}/>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};




export default SignUpButton;
