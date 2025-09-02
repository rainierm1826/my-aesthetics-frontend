import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropDownAppointmentStatus = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="1">Completed</SelectItem>
        <SelectItem value="1">Waiting</SelectItem>
        <SelectItem value="1">Pending</SelectItem>
        <SelectItem value="1">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DropDownAppointmentStatus;
