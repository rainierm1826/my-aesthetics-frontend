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
import { Label } from "@/components/ui/label";
import { MapPin, Upload, X } from "lucide-react";
import Image from "next/image";
import { BranchFormProps, BranchFormState } from "@/lib/branch-types";
import { patchBranch, postBranch } from "@/api/branch";
import { fileToBase64 } from "@/lib/function";
import { useBaseMutation } from "@/hooks/useBaseMutation";

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
        setFormData({
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

  const handleSubmit = async () => {
    let imageBase64 = "";
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    } else if (typeof formData.image === "string") {
      imageBase64 = formData.image;
    }

    const payload = {
      branch_name: formData.branch_name,
      image: imageBase64,
      address: {
        region: formData.address.region,
        province: formData.address.province,
        city: formData.address.city,
        barangay: formData.address.barangay,
        lot: formData.address.lot,
      },
      ...(method === "patch" && { branch_id: branchId }),
    };
    branchMutation.mutate(payload);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "branch_name") {
      setFormData((prev) => ({ ...prev, branch_name: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    }
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

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="branch-name">Branch Name</Label>
          <Input
            id="branch-name"
            placeholder="Enter branch name"
            value={formData.branch_name}
            onChange={(e) => handleInputChange("branch_name", e.target.value)}
          />
        </div>

        {/* image input and preview */}
        <div className="space-y-2">
          <Label htmlFor="branch-image">Branch Image</Label>

          {!imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload branch image
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
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
                className="absolute -top-4 -right-4 p-1 rounded-full "
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Address</Label>

          <div className="space-y-1">
            <Label htmlFor="region" className="text-xs text-gray-600">
              Region
            </Label>
            <Input
              id="region"
              placeholder="Enter region"
              value={formData.address.region}
              onChange={(e) => handleInputChange("region", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="province" className="text-xs text-gray-600">
              Province
            </Label>
            <Input
              id="province"
              placeholder="Enter province"
              value={formData.address.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="city" className="text-xs text-gray-600">
              City
            </Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={formData.address.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="barangay" className="text-xs text-gray-600">
              Barangay
            </Label>
            <Input
              id="barangay"
              placeholder="Enter barangay"
              value={formData.address.barangay}
              onChange={(e) => handleInputChange("barangay", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="lot" className="text-xs text-gray-600">
              Lot/Street Address
            </Label>
            <Input
              id="lot"
              placeholder="Enter lot/street address"
              value={formData.address.lot}
              onChange={(e) => handleInputChange("lot", e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
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

  return <div>{formContent}</div>;
};

export default memo(BranchForm);
