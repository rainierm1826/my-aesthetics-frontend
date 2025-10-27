"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/provider/store/authStore";
import { useAestheticianSlot } from "@/hooks/useAestheticianSlot";

interface DropDownSlotProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  aestheticianId: string;
  serviceId: string;
  date: string;
}

const DropDownSlot = ({
  onValueChange,
  value,
  placeholder = "Select slot",
  includeAllOption = false,
  useUrlParams = false,
  aestheticianId,
  serviceId,
  date,
}: DropDownSlotProps) => {
  const { access_token } = useAuthStore();
  const { data, isLoading, error } = useAestheticianSlot({
    aestheticianId,
    serviceId,
    date,
    token: access_token || "",
  });

  const availableSlots: string[] = data?.available_slots ?? [];
  const serviceDuration: number = data?.service_duration ?? 0;
  const workingHours = data?.working_hours ?? {
    start_hour: 10,
    start_minute: 0,
    end_hour: 17,
    end_minute: 0,
  };
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSlot = useUrlParams
    ? searchParams.get("slot") || (includeAllOption ? "all" : "")
    : value || "";

  // Convert time string to comparable format for sorting
  const timeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    const [hoursStr, minutesStr] = time.split(":");
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Generate all possible time slots based on working hours from backend
  const generateAllSlots = () => {
    const slots: string[] = [];
    
    // Use service duration for intervals, default to 30 if not available
    const interval = serviceDuration || 30;

    // eslint-disable-next-line prefer-const
    let current = new Date();
    current.setHours(workingHours.start_hour, workingHours.start_minute, 0, 0);
    const endTime = new Date();
    endTime.setHours(workingHours.end_hour, workingHours.end_minute, 0, 0);

    while (current < endTime) {
      // Format time as "HH:MM AM/PM" (matches backend format "%I:%M %p" with leading zero)
      const minutes = String(current.getMinutes()).padStart(2, "0");
      const period = current.getHours() >= 12 ? "PM" : "AM";
      let displayHours = current.getHours() % 12;
      if (displayHours === 0) displayHours = 12;
      const displayHoursStr = String(displayHours).padStart(2, "0");
      
      const formattedTime = `${displayHoursStr}:${minutes} ${period}`;
      slots.push(formattedTime);
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  };

  // Get all slots (generated list, available marked by backend)
  const allSlots = generateAllSlots();

  // Check if slot END time is in the past (slot start + duration)
  const isSlotInPast = (slot: string, selectedDate: string) => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    // If selected date is not today, no slots are in the past
    if (selectedDateObj.toDateString() !== today.toDateString()) {
      return false;
    }

    // Parse the slot time (e.g., "10:30 AM")
    const [time, period] = slot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let slotHours = hours;
    if (period === "PM" && hours !== 12) {
      slotHours += 12;
    } else if (period === "AM" && hours === 12) {
      slotHours = 0;
    }

    // Calculate slot END time (start + service duration)
    const slotStartTime = new Date();
    slotStartTime.setHours(slotHours, minutes, 0, 0);
    const slotEndTime = new Date(slotStartTime.getTime() + serviceDuration * 60000);

    // Slot is in the past if END time has passed
    return slotEndTime <= today;
  };

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams.toString());

        if (newValue === "all" && includeAllOption) {
          params.delete("slot");
        } else {
          params.set("slot", newValue);
        }
        params.delete("page");

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
      }

      onValueChange?.(newValue);
    },
    [
      useUrlParams,
      pathname,
      router,
      includeAllOption,
      onValueChange,
      searchParams,
    ]
  );

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading slots..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__loading" disabled>
            Loading...
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading slots" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__error" disabled>
            Failed to load slots
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentSlot} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && <SelectItem value="all">All Slots</SelectItem>}

        {allSlots.map((slot) => {
          const isAvailable = availableSlots.includes(slot);
          const isPast = isSlotInPast(slot, date);
          const isDisabled = !isAvailable || isPast;

          let label = slot;
          if (!isAvailable) {
            label += " (Booked)";
          } else if (isPast) {
            label += " (Past)";
          }

          return (
            <SelectItem
              key={slot}
              value={slot}
              disabled={isDisabled}
              className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default DropDownSlot;
