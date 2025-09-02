"use client";

import React from "react";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import ProfilePicture from "../ProfilePicture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { signOut } from "@/api/auth";
import SignUpButton from "../buttons/SignUpButton";
import BookNowButton from "../buttons/BookNowButton";
import Link from "next/link";

const DropDownMenuCustomerProfile = () => {
  const { isAuth, clearAuth, auth, isAuthLoading } = useAuthStore();
  const { user, clearUser } = useUserStore();

  const router = useRouter();

  const signOutMutation = useBaseMutation("post", {
    queryKey: "account",
    createFn: signOut,
    onSuccess: async () => {
      router.push("/");
      clearAuth();
      clearUser();
    },
    successMessages: {
      create: "Sign Out Successfully",
    },
  });

  const isLoading = signOutMutation.isPending;

  return isAuthLoading || isLoading ? (
    <p>Loading...</p>
  ) : isAuth ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-0 cursor-pointer">
        <ProfilePicture
          image={user?.image || "https://github.com/shadcn.png"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {auth?.role === "customer" && (
          <DropdownMenuItem asChild>
            <Link href="/customer/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/customer/profile">Profile</Link>
        </DropdownMenuItem>
        {auth?.role === "customer" && (
          <DropdownMenuItem asChild>
            <Link href="/customer/history">History</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => signOutMutation.mutate()}
          disabled={isLoading}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="md:flex gap-3 hidden">
      <SignUpButton />
      <BookNowButton size="" />
    </div>
  );
};

export default DropDownMenuCustomerProfile;
