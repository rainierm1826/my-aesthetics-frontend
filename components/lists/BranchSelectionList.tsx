"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import BranchSelectionCard from "@/components/cards/BranchSelectionCard";

interface BranchSelectionProps {
  initialBranches: Branch[];
}

const BranchSelectionList: React.FC<BranchSelectionProps> = ({
  initialBranches,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Branch</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
        {initialBranches.map((branch) => (
          <BranchSelectionCard
            key={branch.branch_id}
            branch={branch}
            isSelected={selectedBranch?.branch_id === branch.branch_id}
            onClick={handleBranchSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchSelectionList;
