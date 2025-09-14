"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BranchName } from "@/lib/types/branch-types";
import { DropDownProps } from "@/lib/types/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useBrancheName } from "@/hooks/useBranchName";
import { useAuthStore } from "@/provider/store/authStore";

interface DropDownBranchProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  readonly?: boolean;
}

const DropDownBranch = ({
  onValueChange,
  value,
  placeholder = "Select branch",
  includeAllOption = false,
  useUrlParams = false,
  readonly = false,
}: DropDownBranchProps) => {
  const { data, isLoading, error } = useBrancheName();
  const { isAuthLoading } = useAuthStore();

  const branches: BranchName[] = data?.branch ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentBranch = useUrlParams
    ? searchParams.get("branch") || (includeAllOption ? "all" : "")
    : value || "";

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

        if (newValue === "all" && includeAllOption) {
          params.delete("branch");
        } else {
          params.set("branch", newValue);
        }
        params.delete("page");

        // More direct URL construction
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
      }

      onValueChange?.(newValue);
    },
    [
      useUrlParams,
      searchParams,
      pathname,
      router,
      includeAllOption,
      onValueChange,
    ]
  );

  if (isLoading || isAuthLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading branches..." />
        </SelectTrigger>
        <SelectContent className="">
          <SelectItem value="__loading" disabled>
            Loading...
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__error" disabled>
            Failed to load branches
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentBranch} onValueChange={readonly ? undefined : handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && <SelectItem value="all">All Branches</SelectItem>}

        {branches.length === 0 ? (
          <SelectItem value="__no_branches" disabled>
            No branches available
          </SelectItem>
        ) : (
          branches.map((b) => (
            <SelectItem key={b.branch_id} value={String(b.branch_id)}>
              {b.branch_name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default DropDownBranch;
