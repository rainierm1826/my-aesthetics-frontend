"use client";

import BranchForm from "./BranchForm";
import { ReactNode } from "react";

interface ClientBranchFormProps {
  renderDialog?: boolean;
  formTitle: string;
  formDescription: string;
  branchName?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  lot?: string;
  buttonLabel: string;
  dialogButtonLabel: string | ReactNode;
}

const ClientBranchForm = (props: ClientBranchFormProps) => {


  return <BranchForm {...props}/>;
};

export default ClientBranchForm;
