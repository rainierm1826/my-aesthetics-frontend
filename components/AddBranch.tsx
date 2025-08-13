"use client";

import { useState } from "react";
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

type BranchForm = {
  branchName: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  lot: string;
  image: File | null;
};

const initialForm: BranchForm = {
  branchName: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  lot: "",
  image: null,
};

const AddBranch = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<BranchForm>(initialForm);

  type TextField = Exclude<keyof BranchForm, "image">;
  const handleInputChange = (field: TextField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Branch</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Add New Branch
          </DialogTitle>
          <DialogDescription>
            Create a new branch by filling in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch Name</Label>
            <Input
              id="branch-name"
              placeholder="Enter branch name"
              value={formData.branchName}
              onChange={(e) => handleInputChange("branchName", e.target.value)}
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
                value={formData.region}
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
                value={formData.province}
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
                value={formData.city}
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
                value={formData.barangay}
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
                value={formData.lot}
                onChange={(e) => handleInputChange("lot", e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="button" className="flex-1">
              Add Branch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;
