"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Gift, Percent, Hash } from "lucide-react";
import { memo, ReactNode } from "react";
import DropDownDiscountType from "../selects/DropDownDiscountType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voucherFormSchema, VoucherFormValues } from "@/schema/voucherSchema";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchVoucher, postVoucher } from "@/api/voucher";
import { Form } from "../ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useAuthStore } from "@/provider/store/authStore";

interface FormVoucher {
  method: "post" | "patch";
  renderDialog?: boolean;
  voucherCode?: string;
  formTitle: string;
  formDescription: string;
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  discountType?: string;
  discountAmount?: number;
  minimumSpend?: number;
  quantity?: number;
  validFrom?: string;
  validUntil?: string;
}

const VoucherForm: React.FC<FormVoucher> = ({
  renderDialog = true,
  method,
  voucherCode,
  formTitle,
  formDescription,
  dialogButtonLabel,
  buttonLabel,
  discountAmount,
  discountType,
  quantity,
  validFrom,
  validUntil,
  minimumSpend,
}) => {
  const { access_token } = useAuthStore();

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      discount_type: discountType ?? "",
      discount_amount: discountAmount ?? 1,
      minimum_spend: minimumSpend ?? 0,
      quantity: quantity ?? 1,
      valid_from: validFrom ?? "",
      valid_until: validUntil ?? "",
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const discountTypeValue = watch("discount_type");

  const voucherMutation = useBaseMutation(method, {
    createFn: postVoucher,
    updateFn: patchVoucher,
    queryKey: ["voucher"],
    successMessages: {
      create: "Voucher has been created.",
      update: "Voucher has been updated.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          discount_type: "",
          discount_amount: 1,
          minimum_spend: 0,
          quantity: 1,
          valid_from: "",
          valid_until: "",
        });
      }
    },
  });

  const isLoading = voucherMutation.isPending;

  const onSubmit = async (values: VoucherFormValues) => {
    console.log(values);
    const payload = {
      ...values,
      ...(method === "patch" && { voucher_code: voucherCode }),
    };
    voucherMutation.mutate({ data: payload, token: access_token || "" });
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <FormLabel className="text-sm font-medium">
              Discount Details
            </FormLabel>

            {/* Discount Type & Amount */}
            <div className="grid grid-cols-2">
              <FormField
                control={control}
                name="discount_type"
                render={({ field }) => (
                  <div className="space-y-1">
                    <FormLabel
                      htmlFor="discount-type"
                      className="text-xs text-gray-600"
                    >
                      Discount Type
                    </FormLabel>
                    <DropDownDiscountType
                      value={field.value}
                      onValueChange={(v: string) => field.onChange(v)}
                    />
                  </div>
                )}
              />
              <FormField
                control={control}
                name="discount_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Discount
                      {discountTypeValue === "percentage"
                        ? " Percentage"
                        : " Amount"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          {discountTypeValue === "percentage" ? (
                            <Percent className="h-4 w-4 text-gray-400" />
                          ) : (
                            <span className="text-gray-400 text-sm">₱</span>
                          )}
                        </div>
                        <Input
                          id="discount-amount"
                          type="number"
                          min={discountTypeValue === "percentage" ? 1 : 0.01}
                          max={
                            discountTypeValue === "percentage" ? 100 : undefined
                          }
                          step={discountTypeValue === "percentage" ? 1 : 0.01}
                          placeholder={
                            discountTypeValue === "percentage" ? "10" : "100.00"
                          }
                          className="pl-8"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          disabled={!discountTypeValue}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Minimum Spend & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="minimum_spend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Minimum Spend
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-400 text-sm">₱</span>
                        </div>
                        <Input
                          id="minimum-spend"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Quantity
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Hash className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          placeholder="1"
                          className="pl-8"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Valid From & Valid Until */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <FormField
                control={control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Valid From
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="valid-from"
                          type="date"
                          className="pl-9"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Valid Until
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="valid-until"
                          type="date"
                          className="pl-9"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return <div>{formContent}</div>;
};

export default memo(VoucherForm);
