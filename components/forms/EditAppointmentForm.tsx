"use client";

import React, { memo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import DropDownPaymentMethod from "../selects/DropDownPaymentMethod";
import DropDownAesthetician from "../selects/DropDownAesthetician";
import DropDownService from "../selects/DropDownService";
import DropDownSlot from "../selects/DropDownSlot";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownAppointmentStatus from "../selects/DropDownAppointmentStatus";
import { patchAppointment } from "@/api/appointment";
import { useAuthStore } from "@/provider/store/authStore";
import { Appointment } from "@/lib/types/appointment-types";

// Schema for editing appointments
const editAppointmentSchema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  service_id: z.string().min(1, "Service is required"),
  aesthetician_id: z.string().min(1, "Aesthetician is required"),
  start_time: z.string().min(1, "Time slot is required"),
  date: z.string(),
  status: z.string().min(1, "Status is required"),
  final_payment_method: z.string().min(1, "Payment method is required"),
  voucher_code: z.string().optional(),
});

type EditAppointmentFormValues = z.infer<typeof editAppointmentSchema>;

interface EditAppointmentFormProps {
  appointment: Appointment;
  onSuccess?: () => void;
}

const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
  appointment,
  onSuccess,
}) => {
  const { access_token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to convert 24-hour time to time slot format
  const convertTimeToSlotFormat = (time: string, duration: number = 60): string => {
    if (!time) return "";
    
    // If already in slot format (HH:MM-HH:MM), return as is
    if (time.includes("-")) return time;
    
    // Convert 24-hour time to slot format
    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    const startTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    
    return `${startTime}-${endTime}`;
  };

  // Get appointment date from created_at or use today
  const getAppointmentDate = (): string => {
    if (appointment.created_at) {
      const date = new Date(appointment.created_at);
      return date.toLocaleDateString("en-PH");
    }
    return new Date().toLocaleDateString("en-PH");
  };

  const initialDate = getAppointmentDate();
  const initialTimeSlot = convertTimeToSlotFormat(
    appointment.start_time || "", 
    appointment.duration_snapshot || 60
  );

  const form = useForm<EditAppointmentFormValues>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: {
      branch_id: appointment.branch_id || "",
      service_id: appointment.service_id || "",
      aesthetician_id: appointment.aesthetician_id || "",
      start_time: initialTimeSlot,
      date: initialDate,
      status: appointment.status || "",
      final_payment_method: appointment.final_payment_method || "",
      voucher_code: appointment.voucher_code_snapshot || undefined,
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  const branch = watch("branch_id");
  const service = watch("service_id");
  const aesthetician = watch("aesthetician_id");
  const date = watch("date");

  // Reset form when appointment data changes
  useEffect(() => {
    const newDate = getAppointmentDate();
    const newTimeSlot = convertTimeToSlotFormat(
      appointment.start_time || "", 
      appointment.duration_snapshot || 60
    );

    reset({
      branch_id: appointment.branch_id || "",
      service_id: appointment.service_id || "",
      aesthetician_id: appointment.aesthetician_id || "",
      start_time: newTimeSlot,
      date: newDate,
      status: appointment.status || "",
      final_payment_method: appointment.final_payment_method || "",
      voucher_code: appointment.voucher_code_snapshot || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.appointment_id, reset]);

  const appointmentMutation = useBaseMutation("patch", {
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
      update: "Appointment has been updated.",
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const isLoading = appointmentMutation.isPending || isSubmitting;

  const convertTo24Hour = (time12h: string): string => {
    // Check if already in 24-hour format (HH:MM)
    if (/^\d{2}:\d{2}$/.test(time12h)) {
      return time12h;
    }

    // Convert from 12-hour format
    const [time, period] = time12h.split(" ");
    const [h, m] = time.split(":").map(Number);
    const hours =
      period === "PM" && h !== 12
        ? h + 12
        : period === "AM" && h === 12
          ? 0
          : h;
    return `${String(hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const onSubmit = async (values: EditAppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { voucher_code, ...rest } = values;

      // Extract start time from slot format (HH:MM-HH:MM) if needed
      let startTime = rest.start_time;
      if (startTime.includes("-")) {
        // Extract just the start time from the slot format
        startTime = startTime.split("-")[0];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        ...rest,
        appointment_id: appointment.appointment_id,
        start_time: convertTo24Hour(startTime),
      };

      // Include walk_in_id or user_id based on appointment type
      if (appointment.walk_in_id) {
        payload.walk_in_id = appointment.walk_in_id;
        payload.is_walk_in = true;
      } else if (appointment.user_id) {
        payload.user_id = appointment.user_id;
        payload.is_walk_in = false;
      }

      // Add voucher code if present
      if (values.voucher_code) {
        payload.voucher_code = values.voucher_code;
      }

      await appointmentMutation.mutateAsync({
        data: payload,
        token: access_token || "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Edit Appointment
        </DialogTitle>
        <DialogDescription>
          Update appointment information including branch, aesthetician, time slot, and status.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <input type="hidden" {...form.register("date")} />

          {/* Customer Info Display */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-sm font-semibold text-gray-800 mb-2">Customer Information</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16">Name:</span>
                <span className="text-sm text-gray-900">{appointment.customer_name_snapshot}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16">Phone:</span>
                <span className="text-sm text-gray-900">{appointment.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16">Type:</span>
                <span className="text-sm text-gray-900">
                  {appointment.walk_in_id ? "Walk-in Customer" : "Online Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Status - Prominent */}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Appointment Status</FormLabel>
                <FormControl>
                  <DropDownAppointmentStatus
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                    placeholder="Select status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section: Location & Service */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Location & Service</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Selection */}
              <FormField
                control={control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <DropDownBranch
                        value={field.value || ""}
                        onValueChange={(v) => field.onChange(v)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Selection */}
              <FormField
                control={control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <DropDownService
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                        branchId={branch}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Schedule */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aesthetician Selection */}
              <FormField
                control={control}
                name="aesthetician_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aesthetician</FormLabel>
                    <FormControl>
                      <DropDownAesthetician
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                        branchId={branch}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Slot Selection */}
              <FormField
                control={control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <DropDownSlot
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                        aestheticianId={aesthetician}
                        serviceId={service}
                        date={date}
                        placeholder="Select time slot"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Payment */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Payment</h3>
            
            {/* Payment Method */}
            <FormField
              control={control}
              name="final_payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <DropDownPaymentMethod
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => reset()}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Appointment"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default memo(EditAppointmentForm);
