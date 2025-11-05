"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import StepIndicator from "./StepIndicator";
import BranchSelectionList from "./lists/BranchSelectionList";
import ServiceSelectionList from "./lists/ServiceSelectionList";
import SlotSelectionList from "./lists/SlotSelectionList";
import BookingConfirmation from "./BookingConfirmation";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useRouter } from "next/navigation";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { postAppointment } from "@/api/appointment";
import { getTodayDate } from "@/lib/function";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<"pro" | "regular" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { access_token } = useAuthStore();
  const { user } = useUserStore();
  const router = useRouter();

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
    setSelectedExperience(null);
    setSelectedDate(getTodayDate());
    setSelectedSlot(null);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedExperience(null);
    setSelectedSlot(null);
    setStep(3);
  };

  const handleExperienceSelect = (experience: "pro" | "regular") => {
    setSelectedExperience(experience);
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
    setSelectedExperience(null);
    setSelectedDate(getTodayDate());
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
      ["branch-slots"],
      ["aesthetician-slots"],
    ],
    successMessages: {
      create: "Appointment has been created.",
    },
    onSuccess: () => {
      router.push("/customer/history");
    },
  });

  const handleSubmit = ({
    branch_id,
    service_id,
    start_time,
    voucher_code,
  }: {
    branch_id: string;
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
      aesthetician_experience?: "pro" | "regular";
      date: string;
      start_time: string;
      final_payment_method: string;
      voucher_code?: string;
    } = {
      is_walk_in: false,
      branch_id: branch_id,
      service_id: service_id,
      date: selectedDate,
      start_time: start_time, // Already in 24-hour format from SlotSelectionList
      final_payment_method: "cash",
    };


    if (selectedExperience) {
      payload.aesthetician_experience = selectedExperience;
    }

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

      {/* Step 3: Aesthetician Experience Selection */}
      {step === 3 && selectedBranch && selectedService && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select Aesthetician Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Regular Option */}
            <div
              onClick={() => handleExperienceSelect("regular")}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedExperience === "regular"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">Regular Aesthetician</h3>
              <p className="text-gray-600">Standard service from our trained aestheticians</p>
            </div>

            {/* Pro Option */}
            <div
              onClick={() => handleExperienceSelect("pro")}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedExperience === "pro"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">Pro Aesthetician</h3>
              <p className="text-gray-600">Premium service from our experienced professionals</p>
              <p className="text-sm text-primary font-semibold mt-2">+₱1,500 professional fee</p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!selectedExperience}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedExperience
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue to Time Slot
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Time Slot Selection (Date = Today by default) */}
      {step === 4 &&
        selectedBranch &&
        selectedService &&
        selectedExperience && (
          <div className="space-y-6">
            {/* Time Slot Selection */}
            <SlotSelectionList
              selectedService={selectedService.service_id}
              selectedBranch={selectedBranch.branch_id}
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
        selectedExperience &&
        selectedSlot && (
          <BookingConfirmation
            isConfirming={appointmentMutation.isPending}
            branch={selectedBranch}
            service={selectedService}
            aestheticianExperience={selectedExperience}
            appointmentDate={selectedDate}
            appointmentTime={selectedSlot}
            onConfirm={(voucherCode) =>
              handleSubmit({
                service_id: selectedService.service_id,
                branch_id: selectedBranch.branch_id,
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
