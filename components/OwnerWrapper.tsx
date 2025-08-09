import React from "react";
import OwnerNavbar from "./OwnerNavbar";

interface OwnerWrapperProps {
  title: string;
  children: React.ReactNode;
}

const OwnerWrapper: React.FC<OwnerWrapperProps> = ({ title, children }) => {
  return (
    <div>
      <OwnerNavbar title={title} />
      <div className="container mx-auto py-5 px-5">{children}</div>
    </div>
  );
};

export default OwnerWrapper;
