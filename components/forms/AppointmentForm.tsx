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
} from "@radix-ui/react-dialog";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";

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

  const { control, handleSubmit, reset, } = form;

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
      ...(method === "patch" && { appointment_id: appointmentId }),
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* fields */}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                reset();
              }}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return <div>{formContent}</div>;
};

export default memo(AppointmentForm);
