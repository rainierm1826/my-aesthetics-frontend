import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePagination = () => {
  return (
    <div className="flex items-center gap-3">
      <Pagination className=" flex justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="text-[#7C7C7C]" />
          </PaginationItem>
          <p className="text-2xl font-bold whitespace-nowrap">
            August 26, 2025
          </p>
          <PaginationItem>
            <PaginationNext href="#" className="text-[#7C7C7C]" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0">
            Calendar <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={0}
          alignOffset={0}
          className="!p-0 !m-0 border-0 shadow-none bg-transparent"
          style={{ margin: 0, padding: 0 }}
        >
          <Calendar
            mode="single"
            className="rounded-lg border m-0 mx-0 !bg-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePagination;
