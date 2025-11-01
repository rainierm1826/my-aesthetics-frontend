"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import StepIndicator from "./StepIndicator";
import BranchSelectionList from "./lists/BranchSelectionList";
import ServiceSelectionList from "./lists/ServiceSelectionList";
import AestheticianSelectionList from "./lists/AestheticianSelectionList";
import SlotSelectionList from "./lists/SlotSelectionList";
import BookingConfirmation from "./BookingConfirmation";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useRouter } from "next/navigation";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { postAppointment } from "@/api/appointment";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAesthetician, setSelectedAesthetician] =
    useState<Aesthetician | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { access_token } = useAuthStore();
  const { user } = useUserStore();
  const router = useRouter();

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
    setSelectedAesthetician(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedAesthetician(null);
    setSelectedSlot(null);
    setStep(3);
  };

  const convertTo24Hour = (timeRange: string): string => {
    // Extract the start time from range like "02:00 PM-04:00 PM"
    const startTime = timeRange.split("-")[0].trim(); // Gets "02:00 PM"
    
    const [time, period] = startTime.split(" ");
    const [h, m] = time.split(":").map(Number);
    const hours =
      period === "PM" && h !== 12
        ? h + 12
        : period === "AM" && h === 12
          ? 0
          : h;
    return `${String(hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleAestheticianSelect = (aesthetician: Aesthetician) => {
    setSelectedAesthetician(aesthetician);
    setSelectedSlot(null);
    setStep(4);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinueToConfirmation = () => {
    if (selectedSlot) {
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedBranch(null);
    setSelectedService(null);
    setSelectedAesthetician(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setSelectedSlot(null);
  };

  const appointmentMutation = useBaseMutation("post", {
    createFn: postAppointment,
    queryKey: [
      ["appointment"],
      ["aesthetician-name"],
      ["aesthetician"],
      ["appointment-summary"],
      ["sales-summary"],
      ["analytics-appointments"],
      ["analytics-sales"],
    ],
    successMessages: {
      create: "Appointment has been created.",
    },
    onSuccess: (data) => {
      router.push(data.invoice_url || "/customer/dashboard");
    },
  });

  const handleSubmit = ({
    branch_id,
    aesthetician_id,
    service_id,
    start_time,
    voucher_code,
  }: {
    branch_id: string;
    aesthetician_id: string;
    service_id: string;
    start_time: string;
    voucher_code?: string;
  }) => {
    if (
      !user?.first_name ||
      !user?.last_name ||
      !user?.middle_initial ||
      !user?.phone_number
    ) {
      router.push("/customer/profile");
      return;
    }

    const payload: {
      is_walk_in: boolean;
      branch_id: string;
      service_id: string;
      aesthetician_id: string;
      date: string;
      start_time: string;
      final_payment_method: string;
      voucher_code?: string;
    } = {
      is_walk_in: false,
      branch_id: branch_id,
      service_id: service_id,
      aesthetician_id: aesthetician_id,
      date: selectedDate,
      start_time: convertTo24Hour(start_time),
      final_payment_method: "cash",
    };

    if (voucher_code) {
      payload.voucher_code = voucher_code;
    }

    appointmentMutation.mutate({
      data: payload,
      token: access_token || "",
    });
  };

  return (
    <div>
      <StepIndicator currentStep={step} />

      {/* Back Button */}
      {step > 1 && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          ← Back
        </button>
      )}

      {/* Step 1: Branch Selection */}
      {step === 1 && (
        <BranchSelectionList
          selectedBranch={selectedBranch}
          onBranchSelect={handleBranchSelect}
        />
      )}

      {/* Step 2: Service Selection */}
      {step === 2 && selectedBranch && (
        <ServiceSelectionList
          branchId={selectedBranch.branch_id}
          selectedService={selectedService}
          onServiceSelect={handleServiceSelect}
        />
      )}

      {/* Step 3: Aesthetician Selection */}
      {step === 3 && selectedBranch && selectedService && (
        <AestheticianSelectionList
          branchId={selectedBranch.branch_id}
          selectedAesthetician={selectedAesthetician}
          onAestheticianSelect={handleAestheticianSelect}
        />
      )}

      {/* Step 4: Time Slot Selection (Date = Today by default) */}
      {step === 4 &&
        selectedBranch &&
        selectedService &&
        selectedAesthetician && (
          <div className="space-y-6">
            {/* Time Slot Selection */}
            <SlotSelectionList
              selectedService={selectedService.service_id}
              selectedAesthetician={selectedAesthetician.aesthetician_id}
              selectedDate={selectedDate} // always today's date
              selectedSlot={selectedSlot}
              onSelectSlot={handleSlotSelect}
            />

            {/* Continue Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleContinueToConfirmation}
                disabled={!selectedSlot}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedSlot
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Confirmation
              </button>
            </div>
          </div>
        )}

      {/* Step 5: Confirmation */}
      {step === 5 &&
        selectedBranch &&
        selectedService &&
        selectedAesthetician &&
        selectedSlot && (
          <BookingConfirmation
            isConfirming={appointmentMutation.isPending}
            branch={selectedBranch}
            service={selectedService}
            aesthetician={selectedAesthetician}
            appointmentDate={selectedDate} // still passes today's date
            appointmentTime={selectedSlot}
            onConfirm={(voucherCode) =>
              handleSubmit({
                service_id: selectedService.service_id,
                branch_id: selectedBranch.branch_id,
                aesthetician_id: selectedAesthetician.aesthetician_id,
                start_time: selectedSlot,
                voucher_code: voucherCode,
              })
            }
            onCancel={handleReset}
          />
        )}
    </div>
  );
};

export default BookingFlow;
