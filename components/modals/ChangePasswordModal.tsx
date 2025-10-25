"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useAuthStore } from "@/provider/store/authStore";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { changePassword } from "@/api/user";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords don't match",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) => {
  const { access_token } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  // Change password mutation
  const changePasswordMutation = useBaseMutation("post", {
    queryKey: "change-password",
    createFn: changePassword,
    onSuccess: () => {
      handleClose();
      onSuccess?.();
    },
    successMessages: {
      create: "Password changed successfully",
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    changePasswordMutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
      token: access_token,
    } as any);
  };

  const handleClose = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <FormField
              control={control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...field}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {changePasswordMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  {(changePasswordMutation.error as any)?.message ||
                    "Failed to change password"}
                </p>
              </div>
            )}

            {/* Success Message */}
            {changePasswordMutation.isSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Password changed successfully
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
