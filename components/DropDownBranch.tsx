import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

const DropDownBranch = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0">
          Branch <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Batangas City Branch</DropdownMenuItem>
        <DropdownMenuItem>Lipa City Branch</DropdownMenuItem>
        <DropdownMenuItem>Sto Tomas Branch</DropdownMenuItem>
        <DropdownMenuItem>Lemery Branch</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownBranch;
