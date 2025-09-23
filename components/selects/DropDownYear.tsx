"use client";

import React, { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DropDownYearProps {
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  urlParamKey?: string;
  startYear?: number;
  endYear?: number;
  reverseOrder?: boolean;
}

const DropDownYear = ({
  placeholder = "Select Year",
  includeAllOption = true,
  allOptionLabel = "All Years",
  urlParamKey = "year",
  startYear = 2020,
  endYear = new Date().getFullYear(),
  reverseOrder = true,
}: DropDownYearProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const years = useMemo(() => {
    const yearArray = [];
    for (let year = startYear; year <= endYear; year++) {
      yearArray.push(year);
    }
    return reverseOrder ? yearArray.reverse() : yearArray;
  }, [startYear, endYear, reverseOrder]);

  const currentValue =
    searchParams.get(urlParamKey) || (includeAllOption ? "all" : "");

  const handleValueChange = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams);

      if (newValue === "all" && includeAllOption) {
        params.delete(urlParamKey);
      } else {
        params.set(urlParamKey, newValue);
      }
      params.delete("page");

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router, includeAllOption, urlParamKey]
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
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownYear;
