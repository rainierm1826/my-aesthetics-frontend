"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useAestheticianSlot } from "@/hooks/useAestheticianSlot";
import { useAuthStore } from "@/provider/store/authStore";
import { Clock } from "lucide-react";

interface SlotSelectionListProps {
  selectedService: string;
  selectedAesthetician: string;
  selectedDate: string;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

const SlotSelectionList = ({
  selectedService,
  selectedAesthetician,
  selectedDate,
  selectedSlot,
  onSelectSlot,
}: SlotSelectionListProps) => {
  const { access_token } = useAuthStore();
  const { data, isLoading, error } = useAestheticianSlot({
    aestheticianId: selectedAesthetician,
    serviceId: selectedService,
    date: selectedDate,
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
    const allSlots: string[] = [];
    
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
      allSlots.push(formattedTime);
      current.setMinutes(current.getMinutes() + interval);
    }

    return allSlots.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  };

  // Get all slots (available from backend + booked from missing times)
  const allSlots = generateAllSlots();

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

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allSlots.map((slot: string) => {
          const isAvailable = availableSlots.includes(slot);
          const isPast = isSlotInPast(slot, selectedDate);
          const isDisabled = !isAvailable || isPast;
          const isSelected = selectedSlot === slot;

          return (
            <Card
              key={slot}
              onClick={() => !isDisabled && onSelectSlot(slot)}
              className={`
                relative overflow-hidden cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white hover:bg-green-50 hover:border-green-500 hover:shadow-md border-gray-200"
                }
              `}
            >
              <div className="p-4 flex flex-col items-center justify-center h-16">
                <div
                  className={`text-lg font-semibold ${
                    isSelected
                      ? "text-white"
                      : isDisabled
                        ? "text-gray-400"
                        : "text-gray-900"
                  }`}
                >
                  {slot}
                </div>
                {!isAvailable && !isPast && (
                  <div className="text-xs mt-1 text-gray-500">Booked</div>
                )}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Available indicator */}
              {!isDisabled && !isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
              )}
            </Card>
          );
        })}
      </div>

      {allSlots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No time slots available</p>
        </div>
      )}
    </div>
  );
};

export default SlotSelectionList;
