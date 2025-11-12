"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  // ✅ Keep a local date state to avoid re-renders from searchParams lag
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const today = new Date();
    const dateParam = searchParams.get("date") || value;
    if (dateParam) {
      const [y, m, d] = dateParam.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return today;
  });

  // ✅ Sync local state when URL param changes externally
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [y, m, d] = dateParam.split("-").map(Number);
      const newDate = new Date(y, m - 1, d);
      if (newDate.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(newDate);
      }
    }
  }, [searchParams, currentDate]);

  const displayDate = useMemo(
    () =>
      currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [currentDate]
  );

  // ✅ Utility: format as YYYY-MM-DD without UTC offset
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // ISO-like but local time
  };

  const updateDate = useCallback(
    (newDate: Date) => {
      const dateString = formatDate(newDate);
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", dateString);
      const newUrl = `${pathname}?${params.toString()}`;

      setCurrentDate(newDate); // local update first
      router.replace(newUrl, { scroll: false });
      onValueChange?.(dateString);
    },
    [searchParams, pathname, router, onValueChange]
  );

  const goToPreviousDay = useCallback(() => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    updateDate(prev);
  }, [currentDate, updateDate]);

  const goToNextDay = useCallback(() => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    updateDate(next);
  }, [currentDate, updateDate]);

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) updateDate(date);
    },
    [updateDate]
  );

  return (
    <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
      <Pagination className="flex justify-start">
        <PaginationContent className="flex-wrap">
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
          <p className="text-lg sm:text-2xl font-bold whitespace-nowrap px-2">{displayDate}</p>
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
          <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0 w-full sm:w-auto">
            Calendar <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={0}
          alignOffset={0}
          className="!p-0 !m-0 border-0 shadow-none bg-transparent"
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