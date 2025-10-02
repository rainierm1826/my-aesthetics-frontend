"use client";

import { Branch } from "@/lib/types/branch-types";
import BranchSelectionCard from "@/components/cards/BranchSelectionCard";
import { useBranches } from "@/hooks/useBranches";
import SkeletonCard from "../skeletons/SkeletonCard";

interface BranchSelectionListProps {
  selectedBranch: Branch | null;
  onBranchSelect: (branch: Branch) => void;
}

const BranchSelectionList = ({
  selectedBranch,
  onBranchSelect,
}: BranchSelectionListProps) => {
  const { data, isFetching } = useBranches();
  const branches: Branch[] = data?.branch ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Branch</h2>

      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
          {branches.map((branch) => (
            <BranchSelectionCard
              key={branch.branch_id}
              branch={branch}
              isSelected={selectedBranch?.branch_id === branch.branch_id}
              onClick={onBranchSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchSelectionList;
