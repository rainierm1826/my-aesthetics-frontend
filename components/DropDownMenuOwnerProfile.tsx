"use client";

import React from "react";
import ProfilePicture from "./ProfilePicture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { useUserStore } from "@/provider/store/userStore";
import { useAuthStore } from "@/provider/store/authStore";
import { useRouter } from "next/navigation";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { signOut } from "@/api/auth";

const DropDownMenuOwnerProfile = () => {
  const { clearAuth } = useAuthStore();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-0 cursor-pointer">
        <ProfilePicture
          image={user?.image || "https://github.com/shadcn.png"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/owner/dashboard/appointments">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/owner/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOutMutation.mutate()}
          disabled={isLoading}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuOwnerProfile;
