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

interface DropDownExperienceProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  useUrlParams?: boolean;
  urlParamKey?: string;
}

const DropDownExperience = ({
  onValueChange,
  value,
  placeholder = "All experience",
  includeAllOption = false,
  allOptionLabel = "All experience",
  useUrlParams = false,
  urlParamKey = "experience",
}: DropDownExperienceProps) => {
  const experience = [
    { value: "pro", label: "Professional" },
    { value: "regular", label: "Regular" },
  ];

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = useUrlParams
    ? searchParams.get(urlParamKey) || (includeAllOption ? "all" : "")
    : value || "";

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

        if (newValue === "all" && includeAllOption) {
          params.delete(urlParamKey);
        } else {
          params.set(urlParamKey, newValue);
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
      urlParamKey,
      onValueChange,
    ]
  );

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && (
          <SelectItem value="all">{allOptionLabel}</SelectItem>
        )}
        {experience.map((e) => (
          <SelectItem key={e.value} value={e.value}>
            {e.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownExperience;
