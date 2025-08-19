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
import { Brush, Upload, X } from "lucide-react";
import DropDownSex from "./DropDownSex";
import DropDownBranch from "./DropDownBranch";
import DropDownExperience from "./DropDownExperience";
import Image from "next/image";
import DropDownAvailability from "./DropDownAvailability";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAesthetician, postAesthetician } from "@/api/aesthetician";
import { fileToBase64 } from "@/lib/function";
import { FormAesthetician, InitialAestheticianProps } from "@/lib/aesthetician-types";


const AestheticianForm: React.FC<FormAesthetician> = ({
  renderDialog = true,
  dialogButtonLabel,
  buttonLabel,
  formDescription,
  formTitle,
  aestheticianId,
  firstName,
  lastName,
  middleInitial,
  sex,
  phoneNumber,
  branchId,
  experience,
  image,
  availability,
  method,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );


  const [formData, setFormData] = useState<InitialAestheticianProps>({
    firstName: firstName || "",
    lastName: lastName || "",
    middleInitial: middleInitial || "",
    phoneNumber: phoneNumber || "",
    experience: experience || "",
    sex: sex || "",
    branchId: branchId || "",
    image: image || null,
    availability: availability || "",
  });

  const setField = <K extends keyof InitialAestheticianProps>(
    key: K,
    value: InitialAestheticianProps[K]
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

  const handleInputChange = <K extends keyof InitialAestheticianProps>(
    field: K,
    value: InitialAestheticianProps[K]
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

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: unknown) => postAesthetician(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["aesthetician"],
        type: "all",
      });
      toast("Aesthetician has been created.");
      setFormData({
        firstName: "",
        lastName: "",
        middleInitial: "",
        phoneNumber: "",
        experience: "",
        sex: "",
        branchId: "",
        availability: "",
        image: null,
      });
      setImagePreview(null);
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: unknown) => patchAesthetician(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["aesthetician"],
        type: "all",
      });
      toast("Aesthetician has been updated.");
      setFormData({
        firstName: "",
        lastName: "",
        middleInitial: "",
        phoneNumber: "",
        experience: "",
        sex: "",
        branchId: "",
        availability: "",
        image: null,
      });
      setImagePreview(null);
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const handleSubmit = async () => {
    let imageBase64 = "";
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    } else if (typeof formData.image === "string") {
      imageBase64 = formData.image;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      middle_initial: formData.middleInitial,
      branch_id: formData.branchId,
      phone_number: formData.phoneNumber,
      experience: formData.experience,
      sex: formData.sex,
      availability: formData.availability,
      image: imageBase64,
    };

    if (method === "post") {
      createMutation.mutate(payload);
    }
    if (method === "patch") {
      updateMutation.mutate({ ...payload, aesthetician_id: aestheticianId });
    }
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

      <div className="space-y-6 py-4">
        {/* Profile Photo Section */}
        <div className="space-y-3">
          <Label htmlFor="aesthetician-image" className="text-sm font-medium">
            Profile Photo
          </Label>

          {!imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload profile photo
              </p>
              <p className="text-xs text-gray-400">
                Portrait orientation recommended
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              <Input
                id="aesthetician-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative mx-auto w-32">
              <div className="relative h-32 w-full border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Aesthetician preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 rounded-full h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-7 gap-3">
            <div className="space-y-2 col-span-3">
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

            <div className="space-y-2 col-span-3">
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

            <div className="col-span-1 space-y-2">
              <Label htmlFor="middle-initial" className="text-xs text-gray-600">
                M.I
              </Label>
              <Input
                id="middle-initial"
                placeholder="M"
                maxLength={1}
                className="w-full text-center"
                value={formData.middleInitial}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMiddleInitialChange(e.target.value)
                }
              />
            </div>
          </div>

          {/* Contact & Basic Info Row */}
          <div className="grid grid-cols-3 gap-4">
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

            <div className="space-y-2">
              <Label>Sex</Label>
              <DropDownSex
                value={formData.sex}
                onValueChange={(value) => setField("sex", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Branch</Label>
              <DropDownAvailability
                value={formData.availability}
                onValueChange={(value) => setField("availability", value)}
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <DropDownExperience
                value={formData.experience}
                onValueChange={(value) => setField("experience", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Branch</Label>
              <DropDownBranch
                value={formData.branchId}
                onValueChange={(value) => setField("branchId", value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleSubmit}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return <div>{formContent}</div>;
};

export default memo(AestheticianForm);
