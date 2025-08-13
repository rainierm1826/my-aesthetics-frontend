import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropDownAvailability = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select availability" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Available</SelectItem>
        <SelectItem value="4">Working</SelectItem>
        <SelectItem value="3">On Break</SelectItem>
        <SelectItem value="2">Off Duty</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DropDownAvailability;
