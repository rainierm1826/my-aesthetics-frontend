"use client";

import { AppointmentFormProps } from "@/lib/types/appointment-types";
import React, { memo } from "react";
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
import { postAesthetician } from "@/api/aesthetician";
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
import DropDownSex from "../selects/DropDownSex";
import DropDownAesthetician from "../selects/DropDownAesthetician";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownService from "../selects/DropDownService";

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
  sex,
  phoneNumber,
  branchId,
  serviceId,
  finalPaymentMethod,
  method,
}) => {
  const form = useForm<WalkInAppointmentFormValues>({
    resolver: zodResolver(walkInAppointmentSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      middle_initial: middleInitial || "",
      phone_number: phoneNumber || "",
      sex: sex || "",
      branch_id: branchId || "",
      service_id: serviceId || "",
      aesthetician_id: appointmentId || "",
      final_payment_method: finalPaymentMethod || "",
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const paymentMethod = watch("final_payment_method");
  const isCash = paymentMethod == "cash";
  const branch = watch("branch_id");
  const service = watch("service_id");

  const appointmentMutation = useBaseMutation(method, {
    createFn: postAesthetician,
    queryKey: ["appointment"],
    successMessages: {
      create: "Aesthetician has been created.",
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
          sex: "",
          branch_id: "",
        });
      }
    },
  });

  const isLoading = appointmentMutation.isPending;
  const onSubmit = async (values: WalkInAppointmentFormValues) => {
    const payload = {
      ...values,
      is_walk_in: true,
      ...(method === "patch" && { appointment_id: appointmentId }),
    };

    console.log(payload);

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
            <FormField
              control={control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <DropDownSex
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v)}
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
            {branch && (
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
            {branch && service && (
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

          {isCash && (
            <FormField
              control={control}
              name="to_pay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Pay</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="voucher_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher</FormLabel>
                <FormControl>
                  <Input placeholder="Enter voucher" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
