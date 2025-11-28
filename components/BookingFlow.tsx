"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import StepIndicator from "./StepIndicator";
import BranchSelectionList from "./lists/BranchSelectionList";
import ServiceSelectionList from "./lists/ServiceSelectionList";
import SlotSelectionList from "./lists/SlotSelectionList";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useRouter } from "next/navigation";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { postAppointment } from "@/api/appointment";
import { getTodayDate } from "@/lib/function";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  // Customer-facing multi-service selection (no aesthetician choice here)
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  // Deprecated in per-service flow; kept previously, now removed
  // const [selectedExperience, setSelectedExperience] = useState<"pro" | "regular" | null>(null);
  // const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [serviceSelections, setServiceSelections] = useState<Record<string, { experience: "pro" | "regular" | null; slot: string | null }>>({});
  const [voucherCode, setVoucherCode] = useState<string>("");
  const getTomorrowDate = () => {
    // Always get tomorrow in PH timezone (Asia/Manila), output as YYYY-MM-DD
    const now = new Date();
    // Convert to PH timezone offset
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const phOffset = 8 * 60 * 60000; // UTC+8
    const phDate = new Date(utc + phOffset);
    phDate.setDate(phDate.getDate() + 1);
    // Format as YYYY-MM-DD
    const yyyy = phDate.getFullYear();
    const mm = String(phDate.getMonth() + 1).padStart(2, '0');
    const dd = String(phDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowDate());
  const { access_token } = useAuthStore();
  const { user } = useUserStore();
  const router = useRouter();

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    // Enforce tomorrow onwards for booking flow
    setSelectedDate(getTomorrowDate());
    setSelectedServices([]);
    // cleared via per-service map
    setServiceSelections({});
    setVoucherCode("");
    setStep(2);
  };

  const handleDateChange = (date: string) => {
    console.log('BookingFlow - Date changed to:', date);
    setSelectedDate(date);
    // slots cleared in selections map
    setServiceSelections((prev) => {
      const next: Record<string, { experience: "pro" | "regular" | null; slot: string | null }> = {};
      Object.keys(prev).forEach((k) => {
        next[k] = { ...prev[k], slot: null };
      });
      return next;
    });
  };

  const canContinueFromServices = () => selectedServices.length > 0;
  const canContinueFromPerService = () =>
    selectedServices.length > 0 &&
    selectedServices.every((s) =>
      Boolean(serviceSelections[s.service_id]?.experience && serviceSelections[s.service_id]?.slot)
    );

  const handleContinueFromServices = () => {
    if (canContinueFromServices()) setStep(3);
  };
  const handleContinueFromPerService = () => {
    if (canContinueFromPerService()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedBranch(null);
    setSelectedDate(getTodayDate());
    setSelectedServices([]);
    // cleared via map
    setServiceSelections({});
    setVoucherCode("");
  };

  const [showPostBookingOptions, setShowPostBookingOptions] = useState(false);
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
      setShowPostBookingOptions(true);
    },
  });

  const convertTo24Hour = (time12h: string): string => {
    // Accepts values like "9:00 AM - 10:00 AM" or "9:00 AM"
    const startTimeStr = time12h.split("-")[0].trim();
    const [time, period] = startTimeStr.split(" ");
    const [hStr, mStr] = time.split(":");
    const h = Number(hStr);
    const m = Number(mStr ?? 0);
    const hours = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
    return `${String(hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // Display helper: format a time or time range to 12-hour
  const formatTo12HourRange = (value: string | null): string => {
    if (!value) return "-";
    const parts = value.split("-").map((p) => p.trim());
    const fmt = (v: string): string => {
      // v may be "HH:MM" (24h) or "h:mm AM" (12h)
      if (v.includes("AM") || v.includes("PM")) return v; // already 12h
      const [hStr, mStr] = v.split(":");
      const h24 = Number(hStr);
      const m = Number(mStr ?? 0);
      const period = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 || 12;
      return `${h12}:${String(m).padStart(2, "0")} ${period}`;
    };
    if (parts.length === 2) {
      return `${fmt(parts[0])} - ${fmt(parts[1])}`;
    }
    return fmt(parts[0]);
  };

  const handleSubmit = () => {
    if (
      !user?.first_name ||
      !user?.last_name ||
      !user?.middle_initial ||
      !user?.phone_number
    ) {
      router.push("/customer/profile");
      return;
    }

    if (!selectedBranch) return;

    const payload: Record<string, unknown> = {
      is_walk_in: false,
      branch_id: selectedBranch.branch_id,
      final_payment_method: "cash",
      services: selectedServices.map((s) => ({
        service_id: s.service_id,
        start_time: convertTo24Hour(serviceSelections[s.service_id]?.slot || ""),
        date: selectedDate,
        aesthetician_experience: serviceSelections[s.service_id]?.experience || undefined,
      })),
    };
    if (voucherCode) payload.voucher_code = voucherCode;

    console.log('BookingFlow - Creating appointment with payload:', payload);
    appointmentMutation.mutate({ data: payload, token: access_token || "" });
  };

  return (
    <div>
      <StepIndicator currentStep={step} />

      {/* Post-booking options */}
      {showPostBookingOptions ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Appointment Booked Successfully!</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              onClick={() => router.push("/customer/history")}
            >
              Go to Active Booking
            </button>
            <button
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              onClick={() => {
                setShowPostBookingOptions(false);
                handleReset();
              }}
            >
              Make Another Appointment
            </button>
          </div>
        </div>
      ) : (
        <>
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

          {/* Step 2: Select Services (cards, multi-select) */}
          {step === 2 && selectedBranch && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Select Services</h2>

              {/* Services as cards (multi-select) */}
              <ServiceSelectionList
                branchId={selectedBranch.branch_id}
                multi
                selectedServiceIds={selectedServices.map((s) => s.service_id)}
                onToggleService={(service) => {
                  setSelectedServices((prev) => {
                    const exists = prev.some((s) => s.service_id === service.service_id);
                    const next = exists
                      ? prev.filter((s) => s.service_id !== service.service_id)
                      : [...prev, service];
                    setServiceSelections((old) => {
                      const copy = { ...old };
                      if (exists) {
                        delete copy[service.service_id];
                      } else {
                        copy[service.service_id] = { experience: null, slot: null };
                      }
                      return copy;
                    });
                    return next;
                  });
                }}
              />

              {/* Date selection handled in the next step (single date per transaction) */}

              {/* Bottom spacer for sticky bar */}
              <div className="h-24" />

              {/* Sticky action bar */}
              <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-t px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {selectedServices.length} service(s) selected
                  </div>
                  <Button onClick={handleContinueFromServices} disabled={!canContinueFromServices()}>
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Per-Service Experience and Time Slot */}
          {step === 3 && selectedBranch && selectedServices.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Select Experience and Time for Each Service</h2>

              {/* Global Date (tomorrow onwards) */}
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  min={(() => { const t = new Date(); t.setDate(t.getDate() + 1); return t.toLocaleDateString("en-CA"); })()}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>

              <div className="space-y-6">
                {selectedServices.map((svc) => {
                  const sel = serviceSelections[svc.service_id] || { experience: null, slot: null };
                  return (
                    <div key={svc.service_id} className="rounded-md border p-4">
                      <div className="mb-2">
                        <p className="font-semibold">{svc.service_name}</p>
                        <p className="text-xs text-muted-foreground">{svc.category}</p>
                      </div>

                      {/* Experience choices */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div
                          onClick={() => setServiceSelections((prev) => ({ ...prev, [svc.service_id]: { ...sel, experience: "regular" } }))}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            sel.experience === "regular" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <h3 className="font-medium">Regular Aesthetician</h3>
                          <p className="text-sm text-gray-600">Standard service</p>
                        </div>
                        <div
                          onClick={() => setServiceSelections((prev) => ({ ...prev, [svc.service_id]: { ...sel, experience: "pro" } }))}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            sel.experience === "pro" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <h3 className="font-medium">Pro Aesthetician</h3>
                          <p className="text-sm text-gray-600">+₱1,500 professional fee</p>
                        </div>
                      </div>

                      {/* Slot selection for this service */}
                      <SlotSelectionList
                        selectedService={svc.service_id}
                        selectedBranch={selectedBranch.branch_id}
                        selectedDate={selectedDate}
                        selectedSlot={sel.slot}
                        onSelectSlot={(slot) => setServiceSelections((prev) => ({ ...prev, [svc.service_id]: { ...sel, slot } }))}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Sticky action bar for continue */}
              <div className="h-24" />
              <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-t px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    Select experience and time for each service
                  </div>
                  <Button onClick={handleContinueFromPerService} disabled={!canContinueFromPerService()}>
                    Continue to Confirmation
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && selectedBranch && selectedServices.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{selectedBranch.branch_name ?? selectedBranch.branch_id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedDate}</p>
                </div>
              </div>
              <div className="space-y-2">
                {selectedServices.map((s) => {
                  const sel = serviceSelections[s.service_id];
                  return (
                    <div key={s.service_id} className="rounded-md border p-3">
                      <p className="font-medium">{s.service_name}</p>
                      <p className="text-xs text-gray-500">{s.category}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Experience</p>
                          <p className="text-sm font-medium capitalize">{sel?.experience || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Start Time</p>
                          <p className="text-sm font-medium">{formatTo12HourRange(sel?.slot || null)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Voucher (optional)</label>
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleSubmit} disabled={appointmentMutation.isPending}>
                  {appointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingFlow;
