"use client";

import React, { useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ToggleGroupByProps {
  urlParamKey?: string;
  defaultValue?: string;
}

const ToggleGroupBy = ({
  urlParamKey = "group-by",
  defaultValue = "year",
}: ToggleGroupByProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const groupByOptions = [
    { value: "weekday", label: "Weekly" },
    { value: "month", label: "Monthly" },
    { value: "year", label: "Yearly" },
  ];

  const currentValue = searchParams.get(urlParamKey) || defaultValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue) {
        const params = new URLSearchParams(searchParams);
        params.set(urlParamKey, newValue);
        params.delete("page");

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
      }
    },
    [searchParams, pathname, router, urlParamKey]
  );

  return (
    <ToggleGroup
      type="single"
      value={currentValue}
      onValueChange={handleValueChange}
    >
      {groupByOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="data-[state=on]:bg-[#FBF9F2] text-[#7C7C7C]"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default ToggleGroupBy;
