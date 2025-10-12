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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSlot = useUrlParams
    ? searchParams.get("slot") || (includeAllOption ? "all" : "")
    : value || "";

  // Generate all possible time slots (10:00 AM - 5:00 PM)
  const generateAllSlots = () => {
    const allSlots: string[] = [];
    const startHour = 10;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0);
        const formattedTime = time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        allSlots.push(formattedTime);
      }
    }

    return allSlots;
  };

  // Check if slot is in the past
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

    const slotTime = new Date();
    slotTime.setHours(slotHours, minutes, 0, 0);

    return slotTime <= today;
  };

  const allSlots = generateAllSlots();

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

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
      searchParams,
      pathname,
      router,
      includeAllOption,
      onValueChange,
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
            label += "";
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
