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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Gift, Percent, Hash } from "lucide-react";
import { memo, ReactNode, useState } from "react";

type InitialVoucherProps = {
  discountType: "percentage" | "fixed" | string;
  discountAmount: number;
  minimumSpend: number;
  quantity: number;
  validFrom: string;
  validUntil: string;
};

interface FormVoucher {
  renderDialog?: boolean;
  formTitle: string;
  formDescription: string;
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  discountType?: "percentage" | "fixed" | string;
  discountAmount?: number;
  minimumSpend?: number;
  quantity?: number;
  validFrom?: string;
  validUntil?: string;
}

const VoucherForm: React.FC<FormVoucher> = ({
  renderDialog = true,
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
  const [formData, setFormData] = useState<InitialVoucherProps>({
    discountType: discountType || "",
    discountAmount: discountAmount || 0,
    minimumSpend: minimumSpend || 0,
    quantity: quantity || 0,
    validFrom: validFrom || "",
    validUntil: validUntil || "",
  });

  const handleInputChange = <K extends keyof InitialVoucherProps>(
    field: K,
    value: InitialVoucherProps[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscountAmountChange = (value: number) => {
    if (formData.discountType === "percentage") {
      if (value === 0 || (/^\d*$/.test(value.toString()) && value <= 100)) {
        handleInputChange("discountAmount", value);
      }
    } else {
      if (value === 0 || /^\d*\.?\d*$/.test(value.toString())) {
        handleInputChange("discountAmount", value);
      }
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value === 0 || (/^\d+$/.test(value.toString()) && value > 0)) {
      handleInputChange("quantity", value);
    }
  };

  const handleMinimumSpendChange = (value: number) => {
    if (value === 0 || /^\d*\.?\d*$/.test(value.toString())) {
      handleInputChange("minimumSpend", value);
    }
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

      <div className="space-y-4 py-4">
        {/* Discount Type & Amount */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Discount Details</Label>
          {/* Discount Type */}
          <div className="grid grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="discount-type" className="text-xs text-gray-600">
                Discount Type
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: string) => {
                  handleInputChange("discountType", value);
                  handleInputChange("discountAmount", 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Amount */}
            <div className="space-y-1">
              <Label
                htmlFor="discount-amount"
                className="text-xs text-gray-600"
              >
                Discount
                {formData.discountType === "percentage"
                  ? "Percentage"
                  : "Amount"}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {formData.discountType === "percentage" ? (
                    <Percent className="h-4 w-4 text-gray-400" />
                  ) : (
                    <span className="text-gray-400 text-sm">₱</span>
                  )}
                </div>
                <Input
                  id="discount-amount"
                  placeholder={
                    formData.discountType === "percentage" ? "10" : "100.00"
                  }
                  className="pl-8"
                  value={formData.discountAmount}
                  onChange={(e) =>
                    handleDiscountAmountChange(parseFloat(e.target.value))
                  }
                  disabled={!formData.discountType}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Minimum Spend & Quantity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minimum-spend">Min. Spend (₱)</Label>
            <Input
              id="minimum-spend"
              placeholder="0.00"
              value={formData.minimumSpend}
              onChange={(e) =>
                handleMinimumSpendChange(parseFloat(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="relative">
              <Hash className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="quantity"
                placeholder="100"
                className="pl-8"
                value={formData.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseFloat(e.target.value))
                }
              />
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Validity Period
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="valid-from" className="text-xs text-gray-600">
                Valid From
              </Label>
              <Input
                id="valid-from"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange("validFrom", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="valid-until" className="text-xs text-gray-600">
                Valid Until
              </Label>
              <Input
                id="valid-until"
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  handleInputChange("validUntil", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">{buttonLabel}</Button>
        </div>
      </div>
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
