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
import { Eye, EyeOff } from "lucide-react";
import DropDownBranch from "../selects/DropDownBranch";
import { ShieldUser } from "lucide-react";
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
  signUpAdminFormSchema,
  SignUpAdminFormValues,
} from "@/schema/signUpSchema";
import { signUpAdmin } from "@/api/auth";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchAdmin } from "@/api/admin";
import { AdminFormProps } from "@/lib/types/admin-type";
import { useAuthStore } from "@/provider/store/authStore";

const AdminForm: React.FC<AdminFormProps> = ({
  renderDialog = true,
  formTitle,
  method,
  buttonLabel,
  formDescription,
  dialogButtonLabel,
  firstName,
  lastName,
  middleInitial,
  email,
  password,
  branchId,
  adminId,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {access_token} = useAuthStore()

  const form = useForm<SignUpAdminFormValues>({
    resolver: zodResolver(signUpAdminFormSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      middle_initial: middleInitial || "",
      email: email || "",
      branch_id: branchId || "",
      password: password
    },
  });

  const { reset, control, handleSubmit } = form;

  const signUpAdminMutation = useBaseMutation(method, {
    createFn: signUpAdmin,
    queryKey: ["account", "admin"],
    successMessages: {
      create: "Admin has been created.",
    },
    onSuccess: (_, m) => {
      if (m === "post") {
        reset({
          first_name: "",
          last_name: "",
          middle_initial: "",
          email: "",
          branch_id: "",
          password: "",
          confirmPassword: "",
        });
      }
    },
  });

  const patchAdminMutation = useBaseMutation(method, {
    updateFn: patchAdmin,
    queryKey: ["account", "admin"],
    successMessages: {
      update: "Admin has been updated.",
    },
  });

  const isLoading =
    signUpAdminMutation.isPending || patchAdminMutation.isPending;

  const onSubmit = async (values: SignUpAdminFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    const payload = {
      ...rest,
      ...(method === "patch" && {
        admin_id: adminId,
      }),
    };
    if (method == "post") {
      signUpAdminMutation.mutate(payload);
    } else {
      patchAdminMutation.mutate({data:payload, token:access_token||""});
    }
  };

  const formContent = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldUser className="h-5 w-5" /> {formTitle}
        </DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* forms */}
          <div className="space-y-4 py-4">
            {/* personal info */}
            <div className="space-y-3">
              <FormLabel className="text-sm font-medium mb-5">
                Personal Information
              </FormLabel>
              <div className="grid grid-cols-7 gap-3">
                <div className="space-y-1 col-span-3">
                  <FormField
                    control={control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
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
                </div>
                <div className="space-y-1 col-span-3">
                  <FormField
                    control={control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
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
                </div>
                <div className="space-y-1 col-span-1">
                  <FormField
                    control={control}
                    name="middle_initial"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel
                          htmlFor="service-name"
                          className="text-xs text-gray-600"
                        >
                          M.I
                        </FormLabel>
                        <FormControl>
                          <Input id="m-i" placeholder="M.I" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* account info */}
            <FormLabel className="text-sm font-medium mb-5 mt-8">
              Account Information
            </FormLabel>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        htmlFor="email"
                        className="text-xs text-gray-600"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={method == "patch"}
                          id="email"
                          placeholder="Enter email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  disabled={method == "patch"}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        htmlFor="password"
                        className="text-xs text-gray-600"
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            placeholder="Enter password"
                            type={showPassword ? "text" : "password"}
                            disabled={method == "patch"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                            disabled={method == "patch"}
                          >
                            {showPassword ? (
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
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        htmlFor="confirmPassword"
                        className="text-xs text-gray-600"
                      >
                        Confirm
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={method == "patch"}
                            id="confirmPassword"
                            placeholder="Confirm password"
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                            disabled={method == "patch"}
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
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="branch_id"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs text-gray-600">
                        Branch
                      </FormLabel>
                      <FormControl>
                        <DropDownBranch
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* notice */}
          {renderDialog && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-5">
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

          {/* action buttons */}
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
