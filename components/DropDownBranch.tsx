import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropDownBranch = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a branch" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Batangas City Branch</SelectItem>
        <SelectItem value="2">Lipa City Branch</SelectItem>
        <SelectItem value="3">Sto Tomas Branch</SelectItem>
        <SelectItem value="4">Lemery City Branch</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DropDownBranch;
