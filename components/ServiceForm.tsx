"use client";

import { memo, ReactNode, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Brush, Upload, X } from "lucide-react";
import Image from "next/image";
import DropDownBranch from "./DropDownBranch";
import DropDownServiceCategory from "./DropDownServiceCategory";
import { Textarea } from "./ui/textarea";

type InitialServiceProps = {
  serviceName: string;
  price: string;
  discount: string;
  category: string;
  isOnSale: boolean;
  image: File | null;
};

interface FormService {
  renderDialog?: boolean;
  buttonLabel: string;
  dialogButtonLabel: string | ReactNode;
  formTitle: string;
  formDescription: string;
  serviceName?: string;
  price?: string;
  discount?: string;
  category?: string;
  isOnSale?: boolean;
  image?: File | null;
}

const ServiceForm: React.FC<FormService> = ({
  renderDialog = true,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  formTitle,
  serviceName,
  price,
  discount,
  category,
  isOnSale = false,
  image = null,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<InitialServiceProps>({
    serviceName: serviceName ?? "",
    price: price ?? "",
    discount: discount ?? "",
    category: category ?? "",
    isOnSale: isOnSale ?? false,
    image: image ?? null,
  });

  // Generic setter with strong typing
  const setField = <K extends keyof FormService>(
    key: K,
    value: FormService[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((reader.result as string) ?? null);
      setField("image", file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setField("image", null);
    const fileInput = document.getElementById(
      "service-image"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const handlePriceChange = (value: string) => {
    // only numbers + optional single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) setField("price", value);
  };

  const handleDiscountChange = (value: string) => {
    // integers 0–100
    if (value === "") return setField("discount", value);
    if (/^\d+$/.test(value)) {
      const n = parseInt(value, 10);
      if (n >= 0 && n <= 100) setField("discount", value);
    }
  };

  // Safe price preview helpers
  const priceNum = Number.parseFloat(formData.price || "0");
  const discountNum = Number.isNaN(
    Number.parseInt(formData.discount || "0", 10)
  )
    ? 0
    : Math.min(100, Math.max(0, Number.parseInt(formData.discount || "0", 10)));
  const discounted = priceNum * (1 - discountNum / 100);

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Brush className="h-5 w-5" />
          {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Service Name */}
        <div className="space-y-2">
          <Label htmlFor="service-name">Service Name</Label>
          <Input
            id="service-name"
            placeholder="Enter service name"
            value={formData.serviceName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setField("serviceName", e.target.value)
            }
          />
        </div>

        {/* Service Image */}
        <div className="space-y-2">
          <Label htmlFor="service-image">Service Image</Label>

          {!imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload service image
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              <Input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="relative h-48 w-full border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Service preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={removeImage}
                className="absolute -top-4 -right-4 p-1 rounded-full "
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Give a short description"
            className="min-h-[150px]"
            id="description"
          />
        </div>

        {/* Price and Discount Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₱)</Label>
            <Input
              id="price"
              placeholder="0.00"
              inputMode="decimal"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePriceChange(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              placeholder="0"
              inputMode="numeric"
              value={formData.discount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDiscountChange(e.target.value)
              }
            />
          </div>
        </div>

        {/* Category and branch*/}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="space-y-2 w-full ">
            <Label htmlFor="category">Category</Label>
            <DropDownServiceCategory />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="category">Branch</Label>
            <DropDownBranch />
          </div>
        </div>

        {/* Sale Toggle */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="on-sale" className="text-sm font-medium">
              On Sale
            </Label>
            <p className="text-xs text-gray-600">
              Mark this service as currently on sale
            </p>
          </div>
          <Switch
            id="on-sale"
            checked={formData.isOnSale}
            onCheckedChange={(checked: boolean) =>
              setField("isOnSale", checked)
            }
          />
        </div>

        {/* Price Preview */}
        {formData.price !== "" && !Number.isNaN(priceNum) && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Price Preview:
            </p>
            <div className="flex items-center gap-2">
              {discountNum > 0 ? (
                <>
                  <span className="text-lg font-bold text-green-600">
                    ₱{discounted.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₱{priceNum.toFixed(2)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    -{discountNum}%
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ₱{priceNum.toFixed(2)}
                </span>
              )}
              {formData.isOnSale && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                  ON SALE
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button type="button" className="flex-1">
            {buttonLabel}
          </Button>
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

  return <div className="">{formContent}</div>;
};

export default memo(ServiceForm);
