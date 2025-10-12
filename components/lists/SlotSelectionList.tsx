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

  // Generate all possible time slots (10:00 AM - 5:00 PM, 30 min intervals)
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
        {allSlots.map((slot) => {
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
