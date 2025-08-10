import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
const DropDownServiceCategory = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0">
          Category <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Semi-Permanent Make-Up</DropdownMenuItem>
        <DropdownMenuItem>Facial & Laser Treatments</DropdownMenuItem>
        <DropdownMenuItem>Waxing Services</DropdownMenuItem>
        <DropdownMenuItem>Diode Laser Hair Removal</DropdownMenuItem>
        <DropdownMenuItem>Others</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownServiceCategory;
