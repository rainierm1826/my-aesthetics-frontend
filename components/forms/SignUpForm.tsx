"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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
                <Input
                  id="password"
                  placeholder="Enter password"
                  type="password"
                  {...field}
                />
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
                <Input
                  id="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  {...field}
                />
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
