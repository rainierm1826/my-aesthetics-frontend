"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DropDownMonthProps {
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  urlParamKey?: string;
  format?: "long" | "short" | "number";
}

const DropDownMonth = ({
  placeholder = "Select Month",
  includeAllOption = true,
  allOptionLabel = "All Months",
  urlParamKey = "month",
  format = "long",
}: DropDownMonthProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const months = [
    { value: "1", long: "January", short: "Jan" },
    { value: "2", long: "February", short: "Feb" },
    { value: "3", long: "March", short: "Mar" },
    { value: "4", long: "April", short: "Apr" },
    { value: "5", long: "May", short: "May" },
    { value: "6", long: "June", short: "Jun" },
    { value: "7", long: "July", short: "Jul" },
    { value: "8", long: "August", short: "Aug" },
    { value: "9", long: "September", short: "Sep" },
    { value: "10", long: "October", short: "Oct" },
    { value: "11", long: "November", short: "Nov" },
    { value: "12", long: "December", short: "Dec" },
  ];

  const currentValue =
    searchParams.get(urlParamKey) || (includeAllOption ? "all" : "");

  const getMonthLabel = (month: (typeof months)[0]) => {
    switch (format) {
      case "short":
        return month.short;
      case "number":
        return month.value;
      case "long":
      default:
        return month.long;
    }
  };

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
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {getMonthLabel(month)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownMonth;
