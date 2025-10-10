"use client";

import { memo, useState } from "react";
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
import DropDownBranch from "../selects/DropDownBranch";
import DropDownServiceCategory from "../selects/DropDownServiceCategory";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { serviceFormSchema, ServiceFormValues } from "@/schema/serviceSchema";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchService, postService } from "@/api/service";
import DropDownDiscountType from "../selects/DropDownDiscountType";
import { ServiceFormProps } from "@/lib/types/service-types";
import { useUserStore } from "@/provider/store/userStore";
import { useAuthStore } from "@/provider/store/authStore";

const ServiceForm: React.FC<ServiceFormProps> = ({
  renderDialog = true,
  method,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  serviceId,
  formTitle,
  serviceName,
  description,
  branchId,
  price,
  discount,
  category,
  discountType,
  priceDiscounted,
  duration,
  isOnSale = false,
  image,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );
  const { user } = useUserStore();
  const { auth, access_token } = useAuthStore();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      service_name: serviceName ?? "",
      price: price ?? 0,
      discount: discount ?? 0,
      category: category ?? "",
      is_sale: isOnSale ?? false,
      image: image ?? null,
      description: description ?? "",
      duration: duration ?? 30,
      branch_id:
        (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
      discount_type: discountType ?? "percentage",
    },
  });

  const { reset, control, handleSubmit, setValue, watch } = form;

  const serviceMutation = useBaseMutation(method, {
    createFn: postService,
    updateFn: patchService,
    queryKey: ["service"],
    successMessages: {
      create: "Service has been created.",
      update: "Service has been updated.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          service_name: "",
          price: 0,
          discount: 0,
          category: "",
          is_sale: false,
          image: null,
          description: "",
          branch_id:
            (auth?.role !== "owner" ? user?.branch?.branch_id : branchId) || "",
          discount_type: "percentage",
        });
        setImagePreview(null);
      }
    },
  });

  // Live values
  const priceValue = Number(watch("price") ?? 0) || 0;
  const discountValue = Number(watch("discount") ?? 0) || 0;
  const discountTypeValue = watch("discount_type");
  const isSaleValue = !!watch("is_sale");

  const rawDiscounted =
    discountTypeValue === "percentage"
      ? priceValue - (priceValue * discountValue) / 100
      : priceValue - discountValue;

  const discountedPrice =
    priceDiscounted ||
    Math.max(0, Number.isFinite(rawDiscounted) ? rawDiscounted : 0);

  const isLoading = serviceMutation.isPending;

  const onSubmit = async (values: ServiceFormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else if (key === "branch_id") {
        if (value === "all") {
        } else {
          formData.append("branch_id", String(value));
        }
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // add discounted_price from rawDiscounted
    formData.set("discounted_price", rawDiscounted.toString());

    // add service_id only on patch
    if (method === "patch" && serviceId) {
      formData.append("service_id", serviceId.toString());
    }

    serviceMutation.mutate({ data: formData, token: access_token || "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((reader.result as string) ?? null);
      setValue("image", file, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null, { shouldValidate: true, shouldDirty: true });
    const fileInput = document.getElementById(
      "service-image"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Brush className="h-5 w-5" />
          {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* service name */}
          <FormField
            control={control}
            name="service_name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="service-name">Service Name</FormLabel>
                <FormControl>
                  <Input
                    id="service-name"
                    placeholder="Enter service name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* service image */}
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem className="mb-2">
                <FormLabel>Service Image</FormLabel>
                <FormControl>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload service image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
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
                      <div className="relative h-56 w-full border rounded-lg overflow-hidden">
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
                        className="absolute -top-4 -right-4 p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Give a short description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* category  and price*/}
          {/* category  and price*/}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <FormControl>
                    <DropDownServiceCategory
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : e.target.valueAsNumber || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* duration */}
          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    id="duration"
                    type="number"
                    inputMode="numeric"
                    placeholder="30"
                    value={field.value ?? 30}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? ""
                          : e.target.valueAsNumber || 30
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* discount type and discount */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="discount_type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <DropDownDiscountType
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="discount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="discount">
                    Discount{" "}
                    {discountTypeValue === "percentage"
                      ? "(%)"
                      : discountTypeValue === "fixed"
                        ? "(₱)"
                        : ""}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="discount"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : e.target.valueAsNumber || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* branch */}
          {auth?.role === "owner" && (
            <FormField
              control={control}
              name="branch_id"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <DropDownBranch
                      includeAllOption
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* is sale */}
          <FormField
            control={control}
            name="is_sale"
            render={({ field }) => (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is-sale" className="text-sm font-medium">
                    On Sale
                  </Label>
                  <p className="text-xs text-gray-600">
                    Mark this service as currently on sale
                  </p>
                </div>

                <Switch
                  id="is-sale"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <div className="flex gap-2 pt-2">
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

      {/* Price Preview */}
      {priceValue > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg border mt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Price Preview:
          </p>
          <div className="flex items-center gap-2">
            {discountValue > 0 ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  ₱{discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₱{priceValue.toFixed(2)}
                </span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  {discountTypeValue === "percentage"
                    ? `-${discountValue}%`
                    : `-₱${discountValue}`}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ₱{priceValue.toFixed(2)}
              </span>
            )}
            {isSaleValue && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                ON SALE
              </span>
            )}
          </div>
        </div>
      )}
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

export default memo(ServiceForm);
