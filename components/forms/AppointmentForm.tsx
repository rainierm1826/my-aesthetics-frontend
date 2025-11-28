"use client";

import { AppointmentFormProps, WalkInAppointmentFormValues as WalkInAppointmentFormValuesType, AppointmentService } from "@/lib/types/appointment-types";
import React, { memo, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Calendar, Trash } from "lucide-react";
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

// Only import WalkInAppointmentFormValues from one place and do not redeclare it in this file.
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


  const isWalkInCustomer = method === "post" || (method === "patch" && !!walkInId);

  const form = useForm<WalkInAppointmentFormValuesType>({
    resolver: zodResolver(walkInAppointmentSchema),
    defaultValues: {
      walk_in_id: walkInId || "",
      branch_id:
        (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
      final_payment_method: finalPaymentMethod || "",
      voucher_code: voucherCode || undefined,
      date: initialDate || new Date().toLocaleDateString("en-CA"),
      status: status || "",
      services: [
        {
          service_id: serviceId || "",
          aesthetician_id: aestheticianId || "",
          start_time: start_time || "",
        },
      ],
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });
  const [addVoucher, setAddVoucher] = useState<boolean>(false);

  const branch = watch("branch_id");
  const date = watch("date");

  // Reset form when props change (e.g., when modal reopens with loaded data)
  useEffect(() => {
    if (method === "patch") {
      reset({
        walk_in_id: walkInId || "",
        branch_id: branchId || "",
        final_payment_method: finalPaymentMethod || "",
        voucher_code: voucherCode || undefined,
        date: initialDate || new Date().toLocaleDateString("en-CA"),
        status: status || "",
        services: [
          {
            service_id: serviceId || "",
            aesthetician_id: aestheticianId || "",
            start_time: start_time || "",
          },
        ] as AppointmentService[],
      } as WalkInAppointmentFormValuesType);
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
          final_payment_method: "",
          branch_id: (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
          voucher_code: undefined,
          date: new Date().toLocaleDateString("en-CA"),
          status: "",
          services: [
            {
              service_id: "",
              aesthetician_id: "",
              start_time: "",
            },
          ],
        } as WalkInAppointmentFormValuesType);
      }
    },
  });

  const isLoading = appointmentMutation.isPending;

  const convertTo24Hour = (time12h: string): string => {
    const startTimeStr = time12h.split("-")[0].trim();
    
    const [time, period] = startTimeStr.split(" ");
    const [h, m] = time.split(":").map(Number);
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

  const onSubmit = async (values: WalkInAppointmentFormValuesType) => {
    const { voucher_code, services, date, ...rest } = values;
    // Build services array with converted times and include date in each service
    const servicesPayload: AppointmentService[] = services.map((s) => ({
      ...s,
      start_time: convertTo24Hour(s.start_time),
      date: date,
    }));

    // Build payload with correct typing, remove root-level date
    const payload: Record<string, unknown> = {
      ...rest,
      is_walk_in: isWalkInCustomer,
      services: servicesPayload,
    };

    if (method === "patch") {
      payload.appointment_id = appointmentId;
      if (walkInId) payload.walk_in_id = walkInId;
      if (userId) {
        payload.user_id = userId;
        delete payload.walk_in_id;
      }
    }
    if (voucher_code) payload.voucher_code = voucher_code;
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

          {/* Branch selection for owners only */}
          {auth?.role === "owner" && (
            <FormField
              control={control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Branch</FormLabel>
                  <FormControl className="w-full">
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

          {/* Multiple Services Section */}
          <div className="space-y-4">
            {fields.map((item, idx) => (
              <div key={item.id} className="border p-4 rounded-md relative bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`services.${idx}.service_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <FormControl className="w-full">
                          <DropDownService
                            value={field.value}
                            onValueChange={field.onChange}
                            branchId={branch}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`services.${idx}.aesthetician_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aesthetician</FormLabel>
                        <FormControl className="w-full">
                          <DropDownAesthetician
                            value={field.value}
                            onValueChange={field.onChange}
                            branchId={branch}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={control}
                    name={`services.${idx}.start_time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot</FormLabel>
                        <FormControl className="w-full">
                          <DropDownSlot
                            value={field.value}
                            onValueChange={field.onChange}
                            branchId={branch}
                            aestheticianId={form.watch(`services.${idx}.aesthetician_id`)}
                            serviceId={form.watch(`services.${idx}.service_id`)}
                            date={date}
                            placeholder="Select time slot"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    onClick={() => remove(idx)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ service_id: "", aesthetician_id: "", start_time: ""})}
            >
              + Add Service
            </Button>
          </div>

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
                  <FormControl className="w-full">
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
