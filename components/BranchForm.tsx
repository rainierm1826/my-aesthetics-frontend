"use client";

import { useState, memo } from "react";
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
import { MapPin, Upload, X } from "lucide-react";
import Image from "next/image";
import { BranchFormProps, BranchFormState } from "@/lib/branch-types";
import { patchBranch, postBranch } from "@/api/branch";
import { fileToBase64 } from "@/lib/function";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { branchFormSchema, BranchFormValues } from "@/schema/branchSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const BranchForm: React.FC<BranchFormProps> = ({
  renderDialog = true,
  method,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  formTitle,
  branchId,
  barangay,
  branchName,
  city,
  image,
  lot,
  province,
  region,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );
  const [formData, setFormData] = useState<BranchFormState>({
    image: image || null,
    branch_name: branchName || "",
    address: {
      region: region || "",
      province: province || "",
      city: city || "",
      barangay: barangay || "",
      lot: lot || "",
    },
  });

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: formData,
  });

  const branchMutation = useBaseMutation(method, {
    createFn: postBranch,
    updateFn: patchBranch,
    queryKey: ["branch"],
    successMessages: {
      create: "Branch has been created.",
      update: "Branch has been updated.",
    },
    onSuccess: (_, method) => {
      if (method === "post") {
        form.reset({
          image: null,
          branch_name: "",
          address: {
            region: "",
            province: "",
            city: "",
            barangay: "",
            lot: "",
          },
        });
        setImagePreview(null);
      }
    },
  });

  const isLoading = branchMutation.isPending;

  const onSubmit = async (values: BranchFormValues) => {
    let imageBase64 = "";
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    } else if (typeof formData.image === "string") {
      imageBase64 = formData.image;
    }
    const payload = {
      branch_name: values.branch_name,
      image: imageBase64,
      address: {
        region: values.address.region,
        province: values.address.province,
        city: values.address.city,
        barangay: values.address.barangay,
        lot: values.address.lot,
      },
      ...(method === "patch" && { branch_id: branchId }),
    };
    branchMutation.mutate(payload);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((reader.result as string) ?? null);
      setFormData((prev) => ({ ...prev, image: file }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    const fileInput = document.getElementById(
      "branch-image"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="branch_name"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter branch name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="mb-5">
                <FormLabel>Branch Image</FormLabel>
                <FormControl>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload branch image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <Input
                        id="branch-image"
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
                          alt="Branch preview"
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
          <div className="space-y-3">
            <FormLabel className="text-sm font-medium">Address</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {/* Region */}
              <FormField
                control={form.control}
                name="address.region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Region
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter region" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Province */}
              <FormField
                control={form.control}
                name="address.province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Province
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Barangay */}
              <FormField
                control={form.control}
                name="address.barangay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Barangay
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barangay" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lot/Street */}
              <FormField
                control={form.control}
                name="address.lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Lot/Street Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter lot/street address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1">
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

export default memo(BranchForm);
