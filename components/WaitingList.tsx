"use client";

import { Ellipsis, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuthStore } from "@/provider/store/authStore";
import { Appointment } from "@/lib/types/appointment-types";
import SkeletonWaitingList from "./skeletons/SkeletonWaitingList";
import { useAppointmentWebSocket } from "@/hooks/useAppointmentWebSocket";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const WaitingList = ({selectedBranchId}:{selectedBranchId:string}) => {
  const [open, setOpen] = useState(false);
  const { access_token } = useAuthStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Enable real-time appointment updates via WebSocket
  useAppointmentWebSocket();

  // Date filter state (store as Date object)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [y, m, d] = dateParam.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return today;
  });

  // Sync local state when URL param changes externally
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [y, m, d] = dateParam.split("-").map(Number);
      const newDate = new Date(y, m - 1, d);
      if (newDate.toDateString() !== selectedDate.toDateString()) {
        setSelectedDate(newDate);
      }
    }
  }, [searchParams, selectedDate]);

  const { data, isFetching } = useAppointments({
    ignoredQuery: true,
    branchId: selectedBranchId,
    token: access_token || "",
  });
  const appointments: Appointment[] = data?.appointment ?? [];

  const handleCalendarSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const dateString = date.toLocaleDateString("en-CA");
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", dateString);
      const newUrl = `${pathname}?${params.toString()}`;

      setSelectedDate(date);
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="mb-4 p-2 w-10 h-10 flex items-center justify-center rounded-full"
            title="View Waiting List"
          >
          <Ellipsis className="w-5 h-5 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Waiting List</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mb-5">
          
            {/* Date filter with calendar popover */}
            <div className="mt-2">
              <label className="block text-xs font-medium mb-1 text-gray-600">Filter by Date</label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {selectedDate ? (
                      selectedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={4}
                  className="w-auto p-0 z-[60]"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {isFetching ? (
              <SkeletonWaitingList />
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium mb-1">
                  No appointments yet
                </p>
                <p className="text-sm text-gray-400">
                  Appointments will appear here when customers check in
                </p>
              </div>
            ) : (
              appointments.map((item) => (
                <div
                  key={item.appointment_id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "waiting"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "on-process"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status === "waiting" ? "confirm" : item.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        {item.start_time 
                          ? format(new Date(item.start_time), "MMM d, yyyy • h:mm a")
                          : "Time not set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        {item.aesthetician_name_snapshot || "No aesthetician assigned"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      </DialogContent>
      
    </Dialog>
  );
};

export default WaitingList;