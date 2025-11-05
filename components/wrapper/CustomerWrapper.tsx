import React from "react";
import CustomerNavbar from "../navigations/CustomerNavbar";

interface CustomerWrapperProps {
  children: React.ReactNode;
}

const CustomerWrapper: React.FC<CustomerWrapperProps> = ({ children }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <CustomerNavbar />
      </div>
      <div className="container mx-auto md:py-5 md:px-5">{children}</div>
    </>
  );
};

export default CustomerWrapper;
