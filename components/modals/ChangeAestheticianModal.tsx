"use client";

import React, { useState } from "react";
import { useAestheticians } from "@/hooks/useAestheticians";
import AestheticianSelectionCard from "@/components/cards/AestheticianSelectionCard";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import { Button } from "@/components/ui/button";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchAppointment } from "@/api/appointment";
import { useAuthStore } from "@/provider/store/authStore";
import { Loader2 } from "lucide-react";

interface ChangeAestheticianModalProps {
  appointmentId: string;
  currentAestheticianId: string;
  branchId: string;
  onClose?: () => void;
  isPro?: boolean;
}

const ChangeAestheticianModal: React.FC<ChangeAestheticianModalProps> = ({
  appointmentId,
  currentAestheticianId,
  isPro,
  branchId,
  onClose,
}) => {
  const { access_token } = useAuthStore();
  const [selectedAesthetician, setSelectedAesthetician] = useState<Aesthetician | null>(null);

  // Fetch aestheticians for the branch
  const { data: aestheticiansData, isLoading } = useAestheticians({ branchId, isPro });

  const updateMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
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
      update: "Aesthetician changed successfully",
    },
    onSuccess: () => {
      onClose?.();
    },
  });

  const handleAestheticianSelect = (aesthetician: Aesthetician) => {
    setSelectedAesthetician(aesthetician);
  };

  const handleConfirm = () => {
    if (!selectedAesthetician) return;

    // Don't allow selecting the same aesthetician (only if there is a current one)
    if (currentAestheticianId && selectedAesthetician.aesthetician_id === currentAestheticianId) {
      return;
    }

    // Create the aesthetician name snapshot
    const aestheticianNameSnapshot = 
      `${selectedAesthetician.first_name} ${selectedAesthetician.middle_initial ? selectedAesthetician.middle_initial + "." : ""} ${selectedAesthetician.last_name}`.trim();

    updateMutation.mutate({
      data: {
        appointment_id: appointmentId,
        aesthetician_id: selectedAesthetician.aesthetician_id,
        aesthetician_name_snapshot: aestheticianNameSnapshot,
      },
      token: access_token || "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const aestheticians = aestheticiansData?.aesthetician || [];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {currentAestheticianId 
          ? "Select a new aesthetician for this appointment"
          : "Assign an aesthetician to this appointment"}
      </div>

      {/* Aesthetician Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
        {aestheticians.map((aesthetician: Aesthetician) => (
          <AestheticianSelectionCard
            key={aesthetician.aesthetician_id}
            aesthetician={aesthetician}
            isSelected={selectedAesthetician?.aesthetician_id === aesthetician.aesthetician_id}
            onClick={handleAestheticianSelect}
          />
        ))}
      </div>

      {aestheticians.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No aestheticians available
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={updateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={
            !selectedAesthetician || 
            updateMutation.isPending || 
            (!!currentAestheticianId && selectedAesthetician?.aesthetician_id === currentAestheticianId)
          }
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : currentAestheticianId ? (
            "Confirm Change"
          ) : (
            "Assign Aesthetician"
          )}
        </Button>
      </div>

      {currentAestheticianId && selectedAesthetician?.aesthetician_id === currentAestheticianId && (
        <p className="text-sm text-amber-600 text-center">
          This aesthetician is already assigned to this appointment
        </p>
      )}
    </div>
  );
};

export default ChangeAestheticianModal;
