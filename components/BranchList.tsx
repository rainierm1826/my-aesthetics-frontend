import React from "react";
import BranchCard from "./BranchCard";
import { getAllBranches } from "@/api/branch";

type BranchesListProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const BranchList = async ({ searchParams }: BranchesListProps) => {
  const getOne = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const filters = {
    search: getOne(searchParams?.search) ?? "",
    page: Number(getOne(searchParams?.page) ?? 1) || 1,
    limit: Number(getOne(searchParams?.limit) ?? 10) || 10,
  };

  const branches = await getAllBranches(filters);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 justify-center px-4 gap-3">
      {branches.branch.map((branch) => (
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
