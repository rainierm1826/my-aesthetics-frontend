"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SignModalContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  showSignUp: boolean;
  setShowSignUp: (show: boolean) => void;
}

const SignModalContext = createContext<SignModalContextProps | undefined>(undefined);

export const useSignModalContext = () => {
  const context = useContext(SignModalContext);
  if (!context) {
    throw new Error("useSignModalContext must be used within a SignModalProvider");
  }
  return context;
};

export const SignModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <SignModalContext.Provider value={{ open, setOpen, showSignUp, setShowSignUp }}>
      {children}
    </SignModalContext.Provider>
  );
};