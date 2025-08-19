import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";

const DropDownExperience = ({
  onValueChange,
  value,
  placeholder = "Select experience",
  includeAllOption = false,
  allOptionLabel = "All Experience",
}: DropDownProps) => {

  const experience = [
    { value: "pro", label: "Professional" },
    { value: "regular", label: "Regular" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
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
