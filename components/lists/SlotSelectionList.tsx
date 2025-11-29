"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useAppointmentSlots } from "@/hooks/useAppointmentSlots";
import { useAuthStore } from "@/provider/store/authStore";
import { Clock } from "lucide-react";
import { TimeSlotRange } from "@/lib/types/aesthetician-types";

interface SlotSelectionListProps {
  selectedService: string;
  selectedBranch: string;
  selectedDate: string;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  onDateChange?: (date: string) => void;
  selectedAesthetician?: string;
  conflictIntervals?: { start: number; end: number }[]; // existing occupied intervals in minutes from 00:00
}

const SlotSelectionList = ({
  selectedService,
  selectedBranch,
  selectedDate,
  selectedSlot,
  onSelectSlot,
  onDateChange,
  selectedAesthetician,
  conflictIntervals = [],
}: SlotSelectionListProps) => {
  const { access_token } = useAuthStore();
  
  // Ensure the date is at least tomorrow
  React.useEffect(() => {
    if (onDateChange) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const minDate = tomorrow.toLocaleDateString("en-CA");
      
      // If selectedDate is not set, empty, or is today or before, set it to tomorrow
      if (!selectedDate || selectedDate < minDate) {
        onDateChange(minDate);
      }
    }
  }, [selectedDate, onDateChange]);
  
  // Debug: Log what date is being used
  console.log('SlotSelectionList - selectedDate:', selectedDate);
  console.log('SlotSelectionList - current local date:', new Date().toLocaleDateString('en-PH'));
  
  const { data, isLoading, error } = useAppointmentSlots({
    branchId: selectedBranch,
    serviceId: selectedService,
    date: selectedDate,
    token: access_token || "",
    aestheticianId: selectedAesthetician,
    usePost: true,
  });

  const availableSlots: TimeSlotRange[] = data?.results?.[0]?.available_slots ?? [];
  
  // Debug: Log the response
  console.log('SlotSelectionList - API response:', { 
    slotsCount: availableSlots.length, 
    firstSlot: availableSlots[0],
    data 
  });

  // Check if slot is clickable based on backend status
  const isSlotClickable = (slot: TimeSlotRange, isConflict: boolean): boolean => {
    // Slot must be available and not conflicting with another selected service
    return slot.status === "available" && !isConflict;
  } 

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Failed to load time slots</p>
          <p className="text-sm text-red-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          <span>Select Time Slot</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 14 }).map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        <span>Select Time Slot</span>
      </h2>

      {/* Date Selection */}
      {onDateChange && (
        <div className="mb-6">
          <label htmlFor="appointment-date" className="block text-sm font-medium mb-2">
            Select Date
          </label>
          <input
            id="appointment-date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={(() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              return tomorrow.toLocaleDateString("en-CA");
            })()}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Past Time / Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span>Conflict (Your Own)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableSlots.map((slot: TimeSlotRange) => {
          const slotDisplay = `${slot.start_time}-${slot.end_time}`;
          // Removed slot24Hour (unused) since conflict logic now relies on intervals
          // Derive slot start in minutes for fine-grained conflict with multi-duration services
          const slotStartMinutes = (() => {
            const [time, period] = slot.start_time.split(" ");
            const [hStr, mStr] = time.split(":");
            let h = Number(hStr);
            const m = Number(mStr || 0);
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return h * 60 + m;
          })();
          // Estimate end minutes using displayed end (backend provided)
          const slotEndMinutes = (() => {
            const [time, period] = slot.end_time.split(" ");
            const [hStr, mStr] = time.split(":");
            let h = Number(hStr);
            const m = Number(mStr || 0);
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return h * 60 + m;
          })();
          const overlapsExisting = conflictIntervals.some(iv => slotStartMinutes < iv.end && iv.start < slotEndMinutes);
          const isConflictOwn = overlapsExisting && selectedSlot !== slotDisplay;
          const isClickable = isSlotClickable(slot, isConflictOwn);
          const isSelected = selectedSlot === slotDisplay;

          // Determine the display label based on slot status
          const getStatusLabel = (status: string): string => {
            if (status === "past") return "Past Time";
            if (status === "booked") return "Booked";
            if (status === "conflict") return "Conflict";
            return "";
          };

          // Use default styles for conflict, just make it unclickable and show label
          let cardClass = "relative overflow-hidden transition-all duration-200";
          if (isSelected) {
            cardClass += " bg-primary text-white border-primary shadow-lg scale-105 cursor-pointer";
          } else if (slot.status === "conflict" || isConflictOwn) {
            cardClass += " bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200";
          } else if (isClickable) {
            cardClass += " bg-white hover:bg-green-50 hover:border-green-500 hover:shadow-md border-gray-200 cursor-pointer";
          } else {
            cardClass += " bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200";
          }

          let textClass = "text-sm font-semibold";
          if (isSelected) {
            textClass += " text-white";
          } else if (slot.status === "conflict" || isConflictOwn) {
            textClass += " text-gray-400";
          } else if (isClickable) {
            textClass += " text-gray-900";
          } else {
            textClass += " text-gray-400";
          }

          return (
            <Card
              key={slotDisplay}
              onClick={() => isClickable && onSelectSlot(slotDisplay)}
              className={cardClass}
            >
              <div className="p-4 flex flex-col items-center justify-center h-16">
                <div className={textClass}>
                  {slotDisplay}
                </div>
                {((!isClickable && !isSelected) || slot.status === "conflict" || isConflictOwn) && (
                  <div className="text-xs mt-1 text-gray-500">
                    {isConflictOwn ? "Conflict" : getStatusLabel(slot.status)}
                  </div>
                )}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Available indicator */}
              {isClickable && !isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
              )}
            </Card>
          );
        })}
      </div>

      {availableSlots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No time slots available</p>
        </div>
      )}
    </div>
  );
};

export default SlotSelectionList;