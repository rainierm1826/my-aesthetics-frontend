"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import StepIndicator from "./StepIndicator";
import BranchSelectionList from "./lists/BranchSelectionList";
import ServiceSelectionList from "./lists/ServiceSelectionList";
import AestheticianSelectionList from "./lists/AestheticianSelectionList";
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
  const { access_token } = useAuthStore();
  const { user } = useUserStore();
  const router = useRouter();

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
    setSelectedAesthetician(null);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedAesthetician(null);
    setStep(3);
  };

  const handleAestheticianSelect = (aesthetician: Aesthetician) => {
    setSelectedAesthetician(aesthetician);
    setStep(4);
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
  }: {
    branch_id: string;
    aesthetician_id: string;
    service_id: string;
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

    appointmentMutation.mutate({
      data: {
        is_walk_in: false,
        branch_id: branch_id,
        service_id: service_id,
        aesthetician_id: aesthetician_id,
        final_payment_method: "cash",
      },
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

      {/* Step 4: Confirmation */}
      {step === 4 &&
        selectedBranch &&
        selectedService &&
        selectedAesthetician && (
          <BookingConfirmation
            isConfirming={appointmentMutation.isPending}
            branch={selectedBranch}
            service={selectedService}
            aesthetician={selectedAesthetician}
            onConfirm={() =>
              handleSubmit({
                service_id: selectedService.service_id,
                branch_id: selectedBranch.branch_id,
                aesthetician_id: selectedAesthetician.aesthetician_id,
              })
            }
            onCancel={handleReset}
          />
        )}
    </div>
  );
};

export default BookingFlow;
