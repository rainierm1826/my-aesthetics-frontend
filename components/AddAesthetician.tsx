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
import { Brush, Upload, X } from "lucide-react";
import DropDownSex from "./DropDownSex";
import DropDownBranch from "./DropDownBranch";
import DropDownExperience from "./DropDownExperience";
import Image from "next/image";

type AestheticianForm = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  phoneNumber: string;
  experience: string;
  sex: string;
  branch: string;
  image: File | null;
};

const initialForm: AestheticianForm = {
  firstName: "",
  lastName: "",
  middleInitial: "",
  phoneNumber: "",
  experience: "",
  sex: "",
  branch: "",
  image: null,
};

const AddAesthetician = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<AestheticianForm>(initialForm);

  const setField = <K extends keyof AestheticianForm>(
    key: K,
    value: AestheticianForm[K]
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

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
      "aesthetician-image"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const handleInputChange = <K extends keyof AestheticianForm>(
    field: K,
    value: AestheticianForm[K]
  ) => setField(field, value);

  const handlePhoneChange = (value: string) => {
    // allow digits, spaces, +, -, ( )
    if (value === "" || /^[\d\s\-\+\(\)]*$/.test(value)) {
      setField("phoneNumber", value);
    }
  };

  const handleMiddleInitialChange = (value: string) => {
    // max 1 alpha char
    if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
      setField("middleInitial", value.toUpperCase());
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Aesthetician</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brush className="h-5 w-5" />
            Add New Aesthetician
          </DialogTitle>
          <DialogDescription>
            Create a new aesthetician profile by filling in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Aesthetician Image */}
          <div className="space-y-2">
            <Label htmlFor="aesthetician-image">Profile Photo</Label>

            {!imagePreview ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload profile photo
                </p>
                <p className="text-xs text-gray-400">
                  Portrait orientation recommended
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
                <Input
                  id="aesthetician-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative mx-auto w-48">
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

          {/* Name Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Personal Information</Label>
            <div className="grid grid-cols-7 gap-3">
              <div className="space-y-1 col-span-3">
                <Label htmlFor="first-name" className="text-xs text-gray-600">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1 col-span-3">
                <Label htmlFor="last-name" className="text-xs text-gray-600">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>

              <div className="col-span-1 space-y-1">
                <Label
                  htmlFor="middle-initial"
                  className="text-xs text-gray-600"
                >
                  M.I
                </Label>
                <Input
                  id="middle-initial"
                  placeholder="M"
                  maxLength={1}
                  className="w-full"
                  value={formData.middleInitial}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMiddleInitialChange(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="e.g., +63 912 345 6789"
                inputMode="tel"
                value={formData.phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePhoneChange(e.target.value)
                }
              />
            </div>

            {/* Experience Dropdown */}
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <DropDownExperience />
            </div>

            {/* Sex Dropdown */}
            <div className="space-y-2">
              <Label>Sex</Label>
              <DropDownSex />
            </div>

            {/* Branch Dropdown */}
            <div className="space-y-2">
              <Label>Assigned Branch</Label>
              <DropDownBranch />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="button" className="flex-1">
              Add Aesthetician
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAesthetician;
