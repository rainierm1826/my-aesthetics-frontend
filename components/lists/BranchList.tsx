"use client";

import React from "react";
import BranchCard from "../cards/BranchCard";
import { Branch } from "@/lib/types/branch-types";
import { useBranches } from "@/hooks/useBranches";
import SkeletonCard from "../skeletons/SkeletonCard";
import SearchInput from "../SearchInput";

const BranchList = ({ action }: { action: boolean }) => {
  const { data, isFetching } = useBranches();
  const branches: Branch[] = data?.branch ?? [];

  return (
    <main className="">
      {/* Actions Section */}
      {action && (
        <div className="max-w-4xl mx-auto mb-8 ">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center flex-col w-full mx-auto sm:w-3/4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 justify-items-center max-w-7xl px-2 sm:px-4">
          {isFetching
            ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : branches.map((branch) => (
                <BranchCard
                  branch_id={branch.branch_id}
                  key={branch.branch_id}
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
      </div>
    </main>
  );
};

export default BranchList;
