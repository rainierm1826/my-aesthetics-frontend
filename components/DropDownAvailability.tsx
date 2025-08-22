import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";

const DropDownAvailability = ({
  onValueChange,
  value,
  placeholder = "Availability",
  includeAllOption = false,
  allOptionLabel = "All Branches",
}: DropDownProps) => {
  const availability = [
    { value: "available", label: "Available" },
    { value: "working", label: "Working" },
    { value: "break", label: "On Break" },
    { value: "off-duty", label: "Off Duty" },
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
