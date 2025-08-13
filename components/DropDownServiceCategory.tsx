import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropDownServiceCategory = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent >
        <SelectItem value="1">Semi-Permanent Make-Up</SelectItem>
        <SelectItem value="2">Facial & Laser Treatments</SelectItem>
        <SelectItem value="3"> Waxing Services</SelectItem>
        <SelectItem value="4">Diode Laser Hair Removal</SelectItem>
        <SelectItem value="5">Others</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DropDownServiceCategory;
