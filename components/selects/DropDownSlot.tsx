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
import { useBranchSlots } from "@/hooks/useBranchSlots";
import { TimeSlotRange } from "@/lib/types/aesthetician-types";

interface DropDownSlotProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  aestheticianId?: string;
  branchId?: string;
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
  branchId,
  serviceId,
  date,
}: DropDownSlotProps) => {
  const { access_token } = useAuthStore();
  
  // Use branch slots if branchId is provided, otherwise use aesthetician slots
  const branchQuery = useBranchSlots(
    branchId ? {
      branchId,
      serviceId,
      date,
      token: access_token || "",
    } : {
      branchId: "",
      serviceId: "",
      date: "",
      token: "",
    }
  );
  
  const aestheticianQuery = useAestheticianSlot(
    aestheticianId ? {
      aestheticianId,
      serviceId,
      date,
      token: access_token || "",
    } : {
      aestheticianId: "",
      serviceId: "",
      date: "",
      token: "",
    }
  );

  const data = branchId ? branchQuery.data : aestheticianQuery.data;
  const isLoading = branchId ? branchQuery.isLoading : aestheticianQuery.isLoading;
  const error = branchId ? branchQuery.error : aestheticianQuery.error;

  const availableSlots = data?.available_slots ?? [];
  
  // Debug: log the number of slots
  console.log('Total slots received:', availableSlots.length);
  console.log('Available slots:', availableSlots.filter(s => s.status === 'available').length);
  console.log('Past slots:', availableSlots.filter(s => s.status === 'past-time').length);
  console.log('Not available slots:', availableSlots.filter(s => s.status === 'not-available').length);
  
  // Debug: log the 4:40 PM slot specifically
  const slot440 = availableSlots.find(s => s.start_time === "04:40 PM");
  if (slot440) {
    console.log('4:40 PM slot:', slot440);
  }
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
      <SelectContent align="end" position="popper" className="max-h-[400px] overflow-y-auto" sideOffset={4}>
        {includeAllOption && <SelectItem value="all">All Slots</SelectItem>}

        {availableSlots.map((slot) => {
          const slotDisplay = formatSlotForDisplay(slot);
          const isClickable = isSlotClickable(slot);
          const statusLabel = getStatusLabel(slot.status);
          const label = slotDisplay + statusLabel;

          return (
            <SelectItem
              key={slotDisplay}
              value={slotDisplay}
              disabled={!isClickable}
              className={!isClickable ? "opacity-50 cursor-not-allowed text-muted-foreground" : ""}
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
