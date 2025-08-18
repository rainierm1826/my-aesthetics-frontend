"use client";

import React from "react";
import BranchCard from "./BranchCard";
import { getAllBranches } from "@/api/branch";
import { useQuery } from "@tanstack/react-query";
import { Branch, BranchListResponse } from "@/lib/branch-types";

const BranchList = () => {
  const { data } = useQuery<BranchListResponse, Error>({
    queryKey: ["branch"],
    queryFn: () => getAllBranches(),
  });

  const branches: Branch[] = data?.branch ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 justify-center px-4 gap-3">
      {branches.map((branch) => (
        <BranchCard
          key={branch.branch_id}
          action
          branchName={branch.branch_name}
          image={branch.image}
          status={branch.status}
          barangay={branch.address.barangay}
          lot={branch.address.lot}
          city={branch.address.city}
          province={branch.address.province}
          rating={branch.avarage_rate}
        />
      ))}
    </div>
  );
};

export default BranchList;
