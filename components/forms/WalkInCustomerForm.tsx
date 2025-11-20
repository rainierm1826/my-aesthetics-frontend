"use client";

import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuthStore } from "@/provider/store/authStore";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { postWalkInCustomer, patchWalkInCustomer } from "@/api/walk-in-customer";

const walkInCustomerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_initial: z.string().max(1, "Middle initial must be 1 character"),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-+()]*$/, "Invalid phone number format"),
});

type WalkInCustomerFormValues = z.infer<typeof walkInCustomerFormSchema>;

interface FormWalkInCustomer {
  renderDialog?: boolean;
  dialogButtonLabel?: string;
  buttonLabel?: string;
  formDescription?: string;
  formTitle?: string;
  walkInId?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  phoneNumber?: string;
  method: "post" | "patch";
}

const WalkInCustomerForm: React.FC<FormWalkInCustomer> = ({
  renderDialog = true,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  formTitle,
  walkInId,
  firstName,
  lastName,
  middleInitial,
  phoneNumber,
  method,
}) => {
  const { access_token } = useAuthStore();

  const form = useForm<WalkInCustomerFormValues>({
    resolver: zodResolver(walkInCustomerFormSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      middle_initial: middleInitial || "",
      phone_number: phoneNumber || "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const walkInMutation = useBaseMutation(method, {
    createFn: postWalkInCustomer,
    updateFn: patchWalkInCustomer,
    queryKey: ["all-customers"],
    successMessages: {
      create: "Walk-in customer has been created.",
      update: "Walk-in customer has been updated.",
    },
    onSuccess: (_: unknown, m: "post" | "patch" | "delete") => {
      if (m === "post") {
        reset({
          first_name: "",
          last_name: "",
          middle_initial: "",
          phone_number: "",
        });
      }
    },
  });

  const isLoading = walkInMutation.isPending;

  const onSubmit = async (values: WalkInCustomerFormValues) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      middle_initial: values.middle_initial,
      phone_number: values.phone_number,
    };

    if (method === "patch" && walkInId) {
      walkInMutation.mutate({
        data: { ...payload, walk_in_id: walkInId },
        token: access_token || "",
      });
    } else {
      walkInMutation.mutate({
        data: payload,
        token: access_token || "",
      });
    }
  };

  // Input helpers
  const onPhoneChange = (raw: string) => {
    if (raw === "" || /^[\d\s\-+()]*$/.test(raw)) {
      form.setValue("phone_number", raw, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onMiddleInitialChange = (raw: string) => {
    if (raw.length <= 1 && /^[A-Za-z]*$/.test(raw)) {
      form.setValue("middle_initial", raw.toUpperCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const formContent = (
    <>
      {renderDialog && (
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {formTitle}
          </DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>
      )}

      {!renderDialog && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            {formTitle}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{formDescription}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel className="mt-2">Personal Information</FormLabel>
          <div className="space-y-6 py-4">
            {/* Name Fields */}
            <div className="space-y-4">
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
                          value={field.value ?? ""}
                          onChange={(e) =>
                            onMiddleInitialChange(e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Number */}
              <FormField
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      htmlFor="phone-number"
                      className="text-xs text-gray-600"
                    >
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="phone-number"
                        placeholder="e.g., +63 912 345 6789"
                        maxLength={11}
                        inputMode="tel"
                        value={field.value ?? ""}
                        onChange={(e) => onPhoneChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default memo(WalkInCustomerForm);
