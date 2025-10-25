"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { signUpFormSchema, SignUpFormValues } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { signUp } from "@/api/auth";

interface SignUpFormProps {
  onContinue: () => void;
}

const SignUpForm = ({ onContinue }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, handleSubmit, getValues } = form;

  const signUpMutation = useBaseMutation("post", {
    queryKey: "account",
    createFn: signUp,
    onSuccess: () => {
      const email = getValues("email");
      localStorage.setItem("email", email);
      onContinue();
    },
  });

  const isLoading = signUpMutation.isPending;

  const onSubmit = async (values: SignUpFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    const payload = { ...rest };

    signUpMutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* email */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="email" className="text-xs text-gray-600">
                Email
              </FormLabel>
              <FormControl>
                <Input
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

        {/* password */}
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="password" className="text-xs text-gray-600">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

        {/* confirm password */}
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
                    id="confirmPassword"
                    placeholder="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        <Button className="w-full mt-3" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
