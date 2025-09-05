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
import { Brush, Upload, X } from "lucide-react";
import DropDownSex from "../selects/DropDownSex";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownExperience from "../selects/DropDownExperience";
import Image from "next/image";
import DropDownAvailability from "../selects/DropDownAvailability";
import { patchAesthetician, postAesthetician } from "@/api/aesthetician";
import { fileToBase64 } from "@/lib/function";
import { FormAesthetician } from "@/lib/types/aesthetician-types";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  aestheticianFormSchema,
  AestheticianFormValues,
} from "@/schema/aestheticianSchema";

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

  const form = useForm<AestheticianFormValues>({
    resolver: zodResolver(aestheticianFormSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      middle_initial: middleInitial || "",
      phone_number: phoneNumber || "",
      experience: experience || "",
      sex: sex || "",
      branch_id: branchId || "",
      image: image || null,
      availability: availability || "available",
    },
  });

  const { control, handleSubmit, reset, setValue, getValues } = form;

  const aestheticianMutation = useBaseMutation(method, {
    createFn: postAesthetician,
    updateFn: patchAesthetician,
    queryKey: [["aesthetician"], ["aesthetician-name"]],
    successMessages: {
      create: "Aesthetician has been created.",
      update: "Aesthetician has been updated.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          first_name: "",
          last_name: "",
          middle_initial: "",
          phone_number: "",
          experience: "",
          sex: "",
          branch_id: "",
          image: null,
          availability: "",
        });
        setImagePreview(null);
      }
    },
  });

  const isLoading = aestheticianMutation.isPending;

  const onSubmit = async (values: AestheticianFormValues) => {
    let imageBase64 = "";
    const img = values.image;

    if (img instanceof File) {
      imageBase64 = await fileToBase64(img);
    } else if (typeof img === "string") {
      imageBase64 = img;
    }
    const payload = {
      ...values,
      image: imageBase64,
      ...(method === "patch" && { aesthetician_id: aestheticianId }),
    };

    aestheticianMutation.mutate(payload);
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
      "aesthetician-image"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  // Input helpers (keeping your UX rules)
  const onPhoneChange = (raw: string) => {
    if (raw === "" || /^[\d\s\-+()]*$/.test(raw)) {
      setValue("phone_number", raw, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onMiddleInitialChange = (raw: string) => {
    if (raw.length <= 1 && /^[A-Za-z]*$/.test(raw)) {
      setValue("middle_initial", raw.toUpperCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
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

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel className="mt-2"> Personal Information</FormLabel>
          <div className="space-y-6 py-4">
            {/* Profile Photo */}
            <FormField
              control={control}
              name="image"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs text-gray-600">
                    Profile Photo
                  </FormLabel>
                  <FormControl>
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
                      <div className="relative mx-auto w-32">
                        <div className="relative h-32 w-full border rounded-lg overflow-hidden">
                          {/* Only render Image when we have a non-empty src */}
                          {imagePreview && (
                            <Image
                              src={imagePreview}
                              alt="Aesthetician preview"
                              fill
                              className="object-cover"
                            />
                          )}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Information */}
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

              {/* Contact & Basic Info */}
              <div className="space-y-5">
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
                          inputMode="tel"
                          value={field.value ?? ""}
                          onChange={(e) => onPhoneChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Sex */}
                  <FormField
                    control={control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs text-gray-600">
                          Sex
                        </FormLabel>
                        <FormControl>
                          <DropDownSex
                            value={field.value ?? ""}
                            onValueChange={(v) => field.onChange(v)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Availability */}
                  <FormField
                    control={control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs text-gray-600">
                          Availability
                        </FormLabel>
                        <FormControl>
                          <DropDownAvailability
                            value={field.value ?? ""}
                            onValueChange={(v) => field.onChange(v)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Experience */}
                <FormField
                  control={control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs text-gray-600">
                        Experience Level
                      </FormLabel>
                      <FormControl>
                        <DropDownExperience
                          value={field.value ?? ""}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch */}
                <FormField
                  control={control}
                  name="branch_id"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs text-gray-600">
                        Assigned Branch
                      </FormLabel>
                      <FormControl>
                        <DropDownBranch
                          value={field.value ?? ""}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  reset();
                  setImagePreview(
                    typeof getValues("image") === "string"
                      ? getValues("image")
                      : null
                  );
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

export default memo(AestheticianForm);
