import React from "react";
import CustomerNavbar from "../navigations/CustomerNavbar";

interface CustomerWrapperProps {
  title: string;
  children: React.ReactNode;
}

const CustomerWrapper: React.FC<CustomerWrapperProps> = ({ title, children }) => {
  return (
    <div>
      <CustomerNavbar title={title} />
      <div className="container mx-auto py-5 px-5">{children}</div>
    </div>
  );
};

export default CustomerWrapper;
