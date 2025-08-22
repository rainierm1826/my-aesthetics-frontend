import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";

const DropDownServiceCategory = ({
  onValueChange,
  value,
  placeholder = "Select a sex",
  includeAllOption = false,
  allOptionLabel = "All Branches",
}: DropDownProps) => {
  const categories = [
    { value: "male", label: "Semi-Permanent Make-Up" },
    { value: "Facial & Laser Treatments", label: "Facial & Laser Treatments" },
    { value: "Waxing Services", label: "Waxing Services" },
    { value: "Diode Laser Hair Removal", label: "Diode Laser Hair Removal" },
    { value: "Others", label: "Others" },
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
