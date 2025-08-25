"use client"

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DropDownAvailabilityProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  useUrlParams?: boolean;
  urlParamKey?: string;
}

const DropDownAvailability = ({
  onValueChange,
  value,
  placeholder = "Availability",
  includeAllOption = false,
  allOptionLabel = "All Availability",
  useUrlParams = false,
  urlParamKey = "availability",
}: DropDownAvailabilityProps) => {
  const availability = [
    { value: "available", label: "Available" },
    { value: "working", label: "Working" },
    { value: "break", label: "On Break" },
    { value: "off-duty", label: "Off Duty" },
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
        const params = new URLSearchParams(searchParams.toString());

        if (newValue === "all" && includeAllOption) {
          params.delete(urlParamKey);
        } else {
          params.set(urlParamKey, newValue);
        }
        params.delete("page");

        const newUrl =
          params.toString().length > 0
            ? `${pathname}?${params.toString()}`
            : pathname;

        router.push(newUrl, { scroll: false });
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
        {availability.map((a) => (
          <SelectItem key={a.value} value={a.value}>
            {a.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownAvailability;
