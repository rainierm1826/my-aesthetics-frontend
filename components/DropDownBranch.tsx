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
import { DropDownProps } from "@/lib/types";

const DropDownBranch = ({
  onValueChange,
  value,
  placeholder = "Select branch",
  includeAllOption = false,
  allOptionLabel = "All Branches",
}: DropDownProps) => {
  const { data, isLoading } = useQuery<BranchNameResponse, Error>({
    queryKey: ["branch", "branch-name"],
    queryFn: getBranchName,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  // ✅ use the correct key from your API
  const branches: BranchName[] = data?.branch ?? [];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger disabled={isLoading}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && (
          <SelectItem value="all">{allOptionLabel}</SelectItem>
        )}
        {branches.map((b) => (
          // ✅ value should be the id
          <SelectItem key={b.branch_id} value={b.branch_id}>
            {b.branch_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownBranch;
