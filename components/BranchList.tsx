"use client";

import React from "react";
import BranchCard from "./BranchCard";
import { Branch } from "@/lib/branch-types";
import { useBranches } from "@/hooks/useBranches";
import SkeletonCard from "./SkeletonCard";

const BranchList = () => {
  const { data, isLoading } = useBranches();
  const branches: Branch[] = data?.branch ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 justify-center px-4 gap-3 max-w-4xl mx-auto">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : branches.map((branch) => (
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
