import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropDownExperience = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select experience" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="1">Pro</SelectItem>
        <SelectItem value="2">Regular</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DropDownExperience;
