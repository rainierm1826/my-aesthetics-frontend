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

interface DropDownCategoryProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  useUrlParams?: boolean;
  urlParamKey?: string;
}

const DropDownServiceCategory = ({
  onValueChange,
  value,
  placeholder = "Category",
  includeAllOption = false,
  allOptionLabel = "All Category",
  useUrlParams = false,
  urlParamKey = "category",
}: DropDownCategoryProps) => {

  const categories = [
    { value: "Semi-Permanent Make-Up", label: "Semi-Permanent Make-Up" },
    { value: "Facial & Laser Treatments", label: "Facial & Laser Treatments" },
    { value: "Waxing Services", label: "Waxing Services" },
    { value: "Diode Laser Hair Removal", label: "Diode Laser Hair Removal" },
    { value: "Others", label: "Others" },
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
        {categories.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownServiceCategory;
