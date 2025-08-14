"use client";

import { useState, memo, ReactNode } from "react";
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
import DropDownBranch from "./DropDownBranch";
import { ShieldUser } from "lucide-react";

type InitialAdminProps = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  email: string;
  password: string;
  branchName: string;
  image: File | null;
};

interface FormAdmin {
  renderDialog?: boolean;
  formTitle: string;
  formDescription: string;
  buttonLabel: string;
  dialogButtonLabel?: string | ReactNode;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  password?: string;
  branchName?: string;
  image?: File | null;
}

const AdminForm: React.FC<FormAdmin> = ({
  renderDialog = true,
  formTitle,
  formDescription,
  dialogButtonLabel,
  buttonLabel,
  firstName,
  lastName,
  middleInitial,
  email,
  password,
  branchName,
  image,
}) => {
  const [formData, setFormData] = useState<InitialAdminProps>({
    firstName: firstName || "",
    lastName: lastName || "",
    middleInitial: middleInitial || "",
    email: email || "",
    branchName: branchName || "",
    image: image || null,
    password: password || "",
  });

  const setField = <K extends keyof InitialAdminProps>(
    key: K,
    value: InitialAdminProps[K]
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleInputChange = <K extends keyof InitialAdminProps>(
    field: K,
    value: InitialAdminProps[K]
  ) => setField(field, value);

  const handleMiddleInitialChange = (value: string) => {
    if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
      setField("middleInitial", value.toUpperCase());
    }
  };

  const handleEmailChange = (value: string) => {
    setField("email", value.toLowerCase());
  };

  const handlePasswordChange = (value: string) => {
    setField("password", value.toLowerCase());
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldUser className="h-5 w-5" /> {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
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
              <Label htmlFor="middle-initial" className="text-xs text-gray-600">
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

        {/* Email and password */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleEmailChange(e.target.value)
              }
            />
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="*******"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePasswordChange(e.target.value)
              }
            />
          </div>
        </div>

        {/* Branch Dropdown */}
        <div className="space-y-2">
          <Label>Assigned Branch</Label>
          <DropDownBranch />
        </div>

        {/* Admin Permissions Notice */}
        {renderDialog && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                !
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Admin Privileges
                </p>
                <p className="text-xs text-amber-700">
                  This account will have administrative access to the assigned
                  branch and can manage services and appointments.
                </p>
              </div>
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

  return <div>{formContent}</div>;
};

export default memo(AdminForm);
