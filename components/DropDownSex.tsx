import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
interface DropDownSexProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  useUrlParams?: boolean;
  urlParamKey?: string;
}

const DropDownSex = ({
  onValueChange,
  value,
  placeholder = "Select a sex",
  includeAllOption = false,
  allOptionLabel = "All",
  useUrlParams = false,
  urlParamKey = "sex",
}: DropDownSexProps) => {
  const sex = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
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

        // If selecting "all" (and it's enabled), remove from URL
        if (newValue === "all" && includeAllOption) {
          params.delete(urlParamKey);
        } else {
          params.set(urlParamKey, newValue);
        }
        // Reset pagination or other dependent params if needed
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
        {sex.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownSex;
