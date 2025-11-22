"use client";

import React from "react";
import { Button } from "../ui/button";
import { useSignModalContext } from "../modals/SignModalContext";

const SignUpButton = () => {
  const { setOpen, setShowSignUp } = useSignModalContext();
  return (
    <Button
      variant={"outline"}
      onClick={() => {
        setShowSignUp(true);
        setOpen(true);
      }}
    >
      Sign-Up
    </Button>
  );
};

export default SignUpButton;
