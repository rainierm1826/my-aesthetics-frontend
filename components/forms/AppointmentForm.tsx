"use client";

import { AppointmentFormProps } from "@/lib/types/appointment-types";
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
import {
  WalkInAppointmentFormValues,
  walkInAppointmentSchema,
} from "@/schema/appointmentSchema";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { DialogHeader } from "../ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DropDownPaymentMethod from "../selects/DropDownPaymentMethod";
import DropDownAesthetician from "../selects/DropDownAesthetician";
import DropDownService from "../selects/DropDownService";
import DropDownSlot from "../selects/DropDownSlot";
import DropDownBranch from "../selects/DropDownBranch";
import { patchAppointment, postAppointment } from "@/api/appointment";
import { Switch } from "../ui/switch";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  renderDialog = true,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  formTitle,
  appointmentId,
  walkInId,
  userId,
  branchId,
  start_time,
  date: initialDate,
  serviceId,
  aestheticianId,
  finalPaymentMethod,
  method,
  voucherCode,
  status,
}) => {
  const { auth, access_token } = useAuthStore();
  const { user } = useUserStore();

  // Determine if this is for a walk-in customer
  // For create (post): Always show walk-in field (creating new walk-in appointment)
  // For edit (patch): Check if walkInId exists (editing walk-in) or userId exists (editing online customer)
  const isWalkInCustomer = method === "post" || (method === "patch" && !!walkInId);

  const form = useForm<WalkInAppointmentFormValues>({
    resolver: zodResolver(walkInAppointmentSchema),
    defaultValues: {
      walk_in_id: walkInId || "",
      branch_id:
        (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
      service_id: serviceId || "",
      aesthetician_id: aestheticianId || "",
      final_payment_method: finalPaymentMethod || "",
      voucher_code: voucherCode || undefined,
      start_time: start_time || "",
      date: initialDate || new Date().toLocaleDateString("en-CA"),
      status: status || "",
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const [addVoucher, setAddVoucher] = useState<boolean>(false);

  const branch = watch("branch_id");
  const service = watch("service_id");
  const aesthetician = watch("aesthetician_id");
  const date = watch("date");

  // Reset form when props change (e.g., when modal reopens with loaded data)
  useEffect(() => {
    if (method === "patch") {
      reset({
        walk_in_id: walkInId || "",
        branch_id: branchId || "",
        service_id: serviceId || "",
        aesthetician_id: aestheticianId || "",
        final_payment_method: finalPaymentMethod || "",
        voucher_code: voucherCode || undefined,
        start_time: start_time || "",
        date: initialDate || new Date().toLocaleDateString("en-CA"),
        status: status || "",
      });
    }
  }, [method, walkInId, branchId, serviceId, aestheticianId, finalPaymentMethod, voucherCode, start_time, initialDate, status, reset]);

  const appointmentMutation = useBaseMutation(method, {
    createFn: postAppointment,
    updateFn: patchAppointment,
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
      update: "Appointment has been updated.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          walk_in_id: "",
          aesthetician_id: "",
          final_payment_method: "",
          service_id: "",
          start_time: "",
          date: new Date().toLocaleDateString("en-CA"),
          branch_id:
            (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
          voucher_code: undefined,
        });
      }
    },
  });

  const isLoading = appointmentMutation.isPending;

  const convertTo24Hour = (time12h: string): string => {
    console.log("AppointmentForm convertTo24Hour input:", time12h);
    
    // Extract start time from range like "04:40 PM-05:00 PM"
    const startTimeStr = time12h.split("-")[0].trim(); // Gets "04:40 PM"
    console.log("Extracted start time:", startTimeStr);
    
    const [time, period] = startTimeStr.split(" ");
    console.log("Time:", time, "Period:", period);
    const [h, m] = time.split(":").map(Number);
    console.log("Hours:", h, "Minutes:", m);
    const hours =
      period === "PM" && h !== 12
        ? h + 12
        : period === "AM" && h === 12
          ? 0
          : h;
    const result = `${String(hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    console.log("AppointmentForm converted result:", result);
    return result;
  };

  const onSubmit = async (values: WalkInAppointmentFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { voucher_code, ...rest } = values;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      ...rest,
      start_time: convertTo24Hour(rest.start_time), // Convert to 24-hour format
      is_walk_in: isWalkInCustomer,
    };

    // For patch (edit) mode
    if (method === "patch") {
      payload.appointment_id = appointmentId;
      
      // Include walk_in_id if editing walk-in appointment
      if (walkInId) {
        payload.walk_in_id = walkInId;
      }
      
      // Include user_id if editing online customer appointment
      if (userId) {
        payload.user_id = userId;
        // Remove walk_in_id for online customers
        delete payload.walk_in_id;
      }
    }

    // Add voucher code if present
    if (values.voucher_code) {
      payload.voucher_code = values.voucher_code;
    }

    appointmentMutation.mutate({ data: payload, token: access_token || "" });
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden fields required by schema */}
          {auth?.role !== "owner" && (
            <input type="hidden" {...form.register("branch_id")} />
          )}

          {/* Walk-in Customer ID - Only show for CREATE mode (post) */}
          {/* For EDIT mode (patch), hide this field but still include it in submission */}
          {method === "post" && (
            <FormField
              control={control}
              name="walk_in_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Walk-in Customer ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter walk-in ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Hidden walk_in_id for editing walk-in appointments */}
          {method === "patch" && walkInId && (
            <input type="hidden" {...form.register("walk_in_id")} />
          )}

          {/* Date Selection */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={new Date().toLocaleDateString("en-CA")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch selection for owners only */}
            {auth?.role === "owner" && (
              <FormField
                control={control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Branch</FormLabel>
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {((branch && method === "post") || method === "patch") && (
              <FormField
                control={control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Service</FormLabel>
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
            )}

            {(method === "patch" ||
              (method === "post" && branch && service)) && (
              <FormField
                control={control}
                name="aesthetician_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Aesthetician</FormLabel>
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
            )}
          </div>

          {/* Time Slot Selection */}
          {(method === "patch" ||
            (method === "post" && aesthetician && service)) && (
            <FormField
              control={control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Time Slot</FormLabel>
                  <FormControl>
                    <DropDownSlot
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                      branchId={branch}
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
          )}

          {/* Status Field - Only for patch (edit) mode */}
          {method === "patch" && (
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="waiting">Waiting</option>
                      <option value="on-process">On Process</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {method == "post" && (
            <div className="flex justify-between items-center shadow-sm rounded-sm px-4 py-2">
              <div>
                <p className="text-sm font-medium">Add voucher</p>
                <p className="text-xs text-muted-foreground">
                  Manually add voucher
                </p>
              </div>
              <Switch
                checked={addVoucher}
                onCheckedChange={() => {
                  setAddVoucher((value) => !value);
                }}
              />
            </div>
          )}
          {addVoucher && method !== "patch" && (
            <FormField
              control={control}
              name="voucher_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voucher</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter voucher"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : buttonLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );

  if (renderDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>{dialogButtonLabel}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return <div>{formContent}</div>;
};

export default memo(AppointmentForm);
