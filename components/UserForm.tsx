"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Edit2,
  Save,
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck
} from "lucide-react";
import { useForm } from "react-hook-form";
import { userFormSchema, UserFormValues } from "@/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/provider/store/userStore";
import { useAuthStore } from "@/provider/store/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import SkeletonSettings from "./SkeletonSettings";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchUser } from "@/api/user";

export default function UserForm() {
  const [isEditing, setIsEditing] = useState(false);

  const { user, updateUser } = useUserStore();
  const { auth, isAuth, access_token } = useAuthStore();
  console.log(user);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_initial: "",
      phone_number: undefined,
      birthday: undefined,
      image: "https://github.com/shadcn.png",
      email: "",
      role: "customer",
      password: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = form;

  const watchedValues = watch();
  const fullName =
    [
      watchedValues.first_name,
      watchedValues.middle_initial && `${watchedValues.middle_initial}.`,
      watchedValues.last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Complete your profile";

  useEffect(() => {
    if (user && auth) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        middle_initial: user.middle_initial || "",
        phone_number: user.phone_number || "",
        birthday: user.birthday || "",
        image: user.image || "https://github.com/shadcn.png",
        email: auth.email || "",
        role: auth.role || "customer",
        password: "",
      });
    }
  }, [user, auth, reset]);

  const userMutation = useBaseMutation("patch", {
    queryKey: "user",
    updateFn: patchUser,
    onSuccess: (data) => {
      updateUser(data.user);
    },
    successMessages: {
      update: "User updated successfully.",
    },
  });

  const isLoading = userMutation.isPending;

  const handleSave = async (values: UserFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, role, ...rest } = values;

    const cleanData = {
      ...rest,
      phone_number: values.phone_number || null,
      birthday: values.birthday || null,
    };
    userMutation.mutate({ data: cleanData, token: access_token });
  };

  const handleCancel = () => {
    if (user && auth) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        middle_initial: user.middle_initial || "",
        phone_number: user.phone_number || "",
        birthday: user.birthday || "",
        image: user.image || "https://github.com/shadcn.png",
        email: auth.email || "",
        role: auth.role || "customer",
        password: "",
      });
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        form.setValue("image", result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuth || !user) {
    return <SkeletonSettings />;
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSubmit(handleSave)}
                disabled={!isDirty || isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card className="overflow-hidden">
            <CardContent className="relative pt-0">
              <div className="flex items-end gap-6 pb-6">
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage src={field.value} alt={fullName} />
                        <AvatarFallback className="text-lg font-semibold">
                          {watchedValues.first_name?.[0] ||
                            user?.first_name?.[0] ||
                            "U"}
                          {watchedValues.last_name?.[0] ||
                            user?.last_name?.[0] ||
                            ""}
                        </AvatarFallback>
                      </Avatar>

                      {isEditing && (
                        <label className="absolute -bottom-0 -right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <Camera className="h-4 w-4" />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                />

                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {fullName}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {watchedValues.email || auth?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {auth?.is_verified ? <ShieldCheck className="h-4 w-4 text-blue-500" /> : <Shield className="h-4 w-4" />}
                    <Badge variant={"secondary"} className="rounded-full">
                      {auth?.role == "admin" ? (
                        `Admin at ${user?.branch?.branch_name}`
                      ) : (
                        <p className="capitalize">{auth?.role}</p>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        {isEditing ? (
                          <Input placeholder="Enter first name" {...field} />
                        ) : (
                          <div className="px-3 py-2 bg-muted rounded-md min-h-10 flex items-center">
                            {field.value || "Not set"}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        {isEditing ? (
                          <Input placeholder="Enter last name" {...field} />
                        ) : (
                          <div className="px-3 py-2 bg-muted rounded-md min-h-10 flex items-center">
                            {field.value || "Not set"}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="middle_initial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Initial</FormLabel>
                      <FormControl>
                        {isEditing ? (
                          <Input
                            placeholder="M"
                            maxLength={1}
                            className="text-center"
                            {...field}
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted rounded-md min-h-10 flex items-center">
                            {field.value || "Not set"}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        {isEditing ? (
                          <Input type="date" {...field} />
                        ) : (
                          <div className="px-3 py-2 bg-muted rounded-md min-h-10 flex items-center">
                            {field.value ? formatDate(field.value) : "Not set"}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        {isEditing ? (
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        ) : (
                          <div className="px-3 py-2 bg-muted rounded-md min-h-10 flex items-center">
                            {field.value || "Not set"}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield className="h-5 w-5" />
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account credentials and security
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground min-h-10 flex items-center justify-between">
                        <Badge variant={"secondary"} className="rounded-full">
                          {field.value}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full"
                        >
                          Read-only
                        </Badge>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password (leave blank to keep current)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Role</FormLabel>
                    <FormControl>
                      <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground min-h-10 flex items-center justify-between">
                        <Badge
                          variant={"secondary"}
                          className="capitalize rounded-full"
                        >
                          {field.value}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full"
                        >
                          Read-only
                        </Badge>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}
