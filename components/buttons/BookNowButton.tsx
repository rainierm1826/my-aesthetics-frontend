"use client";

import React from "react";
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

const BookNowButton = ({ size }: { size: string }) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className={`${size} bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] text-white font-semibold hover:opacity-90 transition-opacity`}
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ maxWidth: "800px" }}
      >
        <div className="hidden md:flex"></div>
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

export default BookNowButton;
