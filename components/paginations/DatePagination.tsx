"use client";

import React, { useCallback, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DatePaginationProps {
  onValueChange?: (value: string) => void;
  value?: string;
}

const DatePagination = ({ onValueChange, value }: DatePaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get current date from URL params or default to today
  const currentDate = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const dateParam = searchParams.get("date") || value || today;
    return new Date(dateParam);
  }, [searchParams, value]);

  // Format date for display
  const displayDate = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [currentDate]);

  // Update URL params with new date
  const updateDate = useCallback(
    (newDate: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      const dateString = newDate.toISOString().split("T")[0];

      params.set("date", dateString);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });

      // Call the optional callback
      onValueChange?.(dateString);
    },
    [searchParams, pathname, router, onValueChange]
  );

  // Navigate to previous day
  const goToPreviousDay = useCallback(() => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    updateDate(previousDay);
  }, [currentDate, updateDate]);

  // Navigate to next day
  const goToNextDay = useCallback(() => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    updateDate(nextDay);
  }, [currentDate, updateDate]);

  // Handle calendar date selection
  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        updateDate(date);
      }
    },
    [updateDate]
  );

  return (
    <div className="flex items-center gap-3">
      <Pagination className=" flex justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="text-[#7C7C7C] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                goToPreviousDay();
              }}
            />
          </PaginationItem>
          <p className="text-2xl font-bold whitespace-nowrap">{displayDate}</p>
          <PaginationItem>
            <PaginationNext
              href="#"
              className="text-[#7C7C7C] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                goToNextDay();
              }}
            />
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
            selected={currentDate}
            onSelect={handleCalendarSelect}
            className="rounded-lg border m-0 mx-0 !bg-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePagination;
