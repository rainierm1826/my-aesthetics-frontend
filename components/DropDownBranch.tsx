"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getBranchName } from "@/api/branch";
import { BranchName, BranchNameResponse } from "@/lib/branch-types";

const DropDownBranch = () => {
  const { data, isLoading } = useQuery<BranchNameResponse, Error>({
    queryKey: ["branch", "branch-name"],
    queryFn: getBranchName,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  const branches: BranchName[] = data?.branch ?? [];

  return (
    <Select>
      <SelectTrigger disabled={isLoading}>
        <SelectValue
          placeholder={isLoading ? "Loading..." : "Select a branch"}
        />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.branch_id} value={branch.branch_id}>
            {branch.branch_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownBranch;
