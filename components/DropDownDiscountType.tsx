import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";

const DropDownDiscountType = ({
  onValueChange,
  value,
  placeholder = "Select a discount type",
  includeAllOption = false,
  allOptionLabel = "All Branches",
}: DropDownProps) => {
  const discountType = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed (₱)" },
  ];
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && (
          <SelectItem value="all">{allOptionLabel}</SelectItem>
        )}
        {discountType.map((d) => (
          <SelectItem key={d.value} value={d.value}>
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownDiscountType;
