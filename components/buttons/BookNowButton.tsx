"use client";

import React from "react";
import { Button } from "../ui/button";
import { useSignModalContext } from "../modals/SignModalContext";
import { useAuthStore } from "@/provider/store/authStore";

const BookNowButton = ({ size, title = "Login" }: { size: string; title?: string }) => {
  const { isAuth } = useAuthStore();
  const { setOpen, setShowSignUp } = useSignModalContext();

  return (
    <>
      <Button
        variant={"default"}
        className={`${size} ${isAuth ? "hidden" : ""} bg-gradient-to-r from-[#d9c67a] to-[#f0e4b3] text-white font-semibold hover:opacity-90 transition-opacity`}
        onClick={() => {
          setShowSignUp(false);
          setOpen(true);
        }}
      >
        {title}
      </Button>
    </>
  );
};

export default BookNowButton;