"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { signIn } from "@/api/auth";
import { signInFormSchema, SignInFormValues } from "@/schema/signInSchema";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/provider/store/authStore";
import { jwtDecode } from "jwt-decode";
import { getUser } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/provider/store/userStore";
import { TokenPayload } from "@/lib/types/types";

type SignInFormProps = {
  onForgotPassword?: () => void;
};

const SignInForm = ({ onForgotPassword }: SignInFormProps) => {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;
  const router = useRouter();
  const queryClient = useQueryClient();

  const signInMutation = useBaseMutation("post", {
    queryKey: "account",
    createFn: signIn,
    onSuccess: async (data) => {
      const decoded: TokenPayload = jwtDecode(data.access_token);

      useAuthStore.getState().setAuth(
        {
          account_id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          is_verified: decoded.is_verified,
        },
        data.access_token
      );
      const user = await queryClient.fetchQuery({
        queryKey: ["user", decoded.sub],
        queryFn: () => getUser(data.access_token),
        staleTime: 5 * 60 * 1000,
      });
      useUserStore.getState().setUser(user.user);

      const redirects = {
        admin: "/manage/appointments",
        owner: "/manage/dashboard/appointments",
        customer: "/customer/dashboard",
      };

      router.push(redirects[decoded.role]);
    },
    successMessages: {
      create: "Sign In Successfully",
    },
  });

  const isLoading = signInMutation.isPending;

  const onSubmit = async (values: SignInFormValues) => {
    signInMutation.mutate(values);
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

        {onForgotPassword && (
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button className="w-full mt-3" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
