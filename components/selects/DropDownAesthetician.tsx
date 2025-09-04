"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAestheticianName } from "@/hooks/useAestheticianName";
import { AestheticianName } from "@/lib/types/aesthetician-types";

interface DropDownAestheticianProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  branchId?:string
}

const DropDownAesthetician = ({
  onValueChange,
  value,
  placeholder = "Select aesthetician",
  includeAllOption = false,
  useUrlParams = false,
  branchId
}: DropDownAestheticianProps) => {
  const { data, isLoading, error } = useAestheticianName(branchId);

  const aestheticians: AestheticianName[] = data?.aesthetician ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentAesthetician = useUrlParams
    ? searchParams.get("aesthetician") || (includeAllOption ? "all" : "")
    : value || "";

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

        if (newValue === "all" && includeAllOption) {
          params.delete("aesthetician");
        } else {
          params.set("aesthetician", newValue);
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

  // Handle loading state
  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading aestheticians..." />
        </SelectTrigger>
        <SelectContent>
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
          <SelectValue placeholder="Error loading aesthetician" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__error" disabled>
            Failed to load aesthetician
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentAesthetician} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && (
          <SelectItem value="all">All Aesthetician</SelectItem>
        )}

        {aestheticians.length === 0 ? (
          <SelectItem value="__no_aesthetician" disabled>
            No aesthetician available
          </SelectItem>
        ) : (
          aestheticians.map((a) => (
            <SelectItem
              key={a.aesthetician_id}
              value={a.aesthetician_id}
            >
              {`${a.first_name} ${a.middle_initial}. ${a.last_name}`}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default DropDownAesthetician;
