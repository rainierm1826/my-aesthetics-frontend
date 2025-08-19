import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types";


const DropDownSex = ({
  onValueChange,
  value,
  placeholder = "Select a sex",
  includeAllOption = false,
  allOptionLabel = "All Branches",
}: DropDownProps) => {
  const sex = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
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
