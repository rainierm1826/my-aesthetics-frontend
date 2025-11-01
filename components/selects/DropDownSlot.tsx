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
import { TimeSlotRange } from "@/lib/types/aesthetician-types";

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

  const availableSlots = data?.available_slots ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSlot = useUrlParams
    ? searchParams.get("slot") || (includeAllOption ? "all" : "")
    : value || "";

  // Format slot for display
  const formatSlotForDisplay = (slot: TimeSlotRange): string => {
    return `${slot.start_time}-${slot.end_time}`;
  };

  // Get status label for a slot
  const getStatusLabel = (status: string): string => {
    if (status === "past-time") return " (Past)";
    if (status === "not-available") return " (Booked)";
    return "";
  };

  // Check if slot is clickable based on status
  const isSlotClickable = (slot: TimeSlotRange): boolean => {
    return slot.status === "available";
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

        {availableSlots.map((slot) => {
          const slotDisplay = formatSlotForDisplay(slot);
          const isClickable = isSlotClickable(slot);
          const label = slotDisplay + getStatusLabel(slot.status);

          return (
            <SelectItem
              key={slotDisplay}
              value={slotDisplay}
              disabled={!isClickable}
              className={!isClickable ? "opacity-50 cursor-not-allowed" : ""}
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
