"use client";

import { AppointmentFormProps } from "@/lib/types/appointment-types";
import React, { memo, useState } from "react";
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
import DropDownBranch from "../selects/DropDownBranch";
import DropDownService from "../selects/DropDownService";
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
  firstName,
  lastName,
  middleInitial,
  phoneNumber,
  branchId,
  serviceId,
  aestheticianId,
  finalPaymentMethod,
  method,
  voucherCode,
}) => {
  const { auth, isAuthLoading } = useAuthStore();
  const { user } = useUserStore();

  const form = useForm<WalkInAppointmentFormValues>({
    resolver: zodResolver(walkInAppointmentSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      middle_initial: middleInitial || "",
      phone_number: phoneNumber || "",
      branch_id:
        auth?.role !== "owner" ? user?.branch?.branch_id || "" : branchId || "",
      service_id: serviceId || "",
      aesthetician_id: aestheticianId || "",
      final_payment_method: finalPaymentMethod || "",
      voucher_code: voucherCode || undefined,
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const [addVoucher, setAddVoucher] = useState<boolean>(false);

  const branch = watch("branch_id");
  const service = watch("service_id");

  const appointmentMutation = useBaseMutation(method, {
    createFn: postAppointment,
    updateFn: patchAppointment,
    queryKey: [["appointment"], ["aesthetician-name"], ["aesthetician"]],
    successMessages: {
      create: "Appointment has been created.",
      update: "Appointment has been updated.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          aesthetician_id: "",
          final_payment_method: "",
          service_id: "",
          first_name: "",
          last_name: "",
          middle_initial: "",
          phone_number: "",
          branch_id: "",
          voucher_code: undefined,
        });
      }
    },
  });

  const isLoading = appointmentMutation.isPending;
  const onSubmit = async (values: WalkInAppointmentFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { voucher_code, ...rest } = values;

    const payload = {
      ...rest,
      is_walk_in: true,
      ...(method === "patch" && { appointment_id: appointmentId }),
      ...(values.voucher_code ? { voucher_code: values.voucher_code } : {}),
    };

    appointmentMutation.mutate(payload);
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
          <div className="grid grid-cols-7 gap-3">
            {/* First Name */}
            <FormField
              control={control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-3">
                  <FormLabel
                    htmlFor="first-name"
                    className="text-xs text-gray-600"
                  >
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="first-name"
                      placeholder="Enter first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-3">
                  <FormLabel
                    htmlFor="last-name"
                    className="text-xs text-gray-600"
                  >
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="last-name"
                      placeholder="Enter last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Initial */}
            <FormField
              control={control}
              name="middle_initial"
              render={({ field }) => (
                <FormItem className="col-span-1 space-y-2">
                  <FormLabel
                    htmlFor="middle-initial"
                    className="text-xs text-gray-600"
                  >
                    M.I
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="middle-initial"
                      placeholder="M"
                      maxLength={1}
                      className="w-full text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isAuthLoading && (
              <FormField
                disabled={auth?.role != "owner" || isAuthLoading}
                control={control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Branch</FormLabel>
                    <FormControl>
                      <DropDownBranch
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={field.value ?? ""}
                        onValueChange={(v) => field.onChange(v)}
                        branchId={branch}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
