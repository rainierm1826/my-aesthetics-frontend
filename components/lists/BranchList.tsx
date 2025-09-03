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
    <main className="bg-[#fffcf9]">
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
      <div className="grid grid-cols-1 mx-10 md:grid-cols-2 justify-center px-4 gap-3 max-w-4xl sm:mx-auto">
        {isFetching
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
    </main>
  );
};

export default BranchList;
