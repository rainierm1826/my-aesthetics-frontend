"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import SignUpButton from "./SignUpButton";
import BookNowButton from "./BookNowButton";
import NavbarSheet from "./NavbarSheet";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import ProfilePicture from "./ProfilePicture";
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

const Navbar = () => {
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

  return (
    <header className="container mx-auto">
      <nav className="flex justify-between items-center h-[60px] px-4">
        {/* logo */}
        <div>
          <Logo mainSize="text-4xl" size="text-xl" href="/" />
        </div>

        {/* nav links */}
        <NavLinks />
        {/* buttons */}

        {isAuthLoading || isLoading ? (
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
        ) :  (
          <div className="md:flex gap-3 hidden">
            <SignUpButton />
            <BookNowButton size="" />
          </div>
        )}

        <div className="flex md:hidden">
          <NavbarSheet />
        </div>
      </nav>
    </header>
  );
};

const NavLinks = () => {
  return (
    <ul className="md:flex gap-10 text-[#7C7C7C] text-sm hidden">
      <li>
        <Link href={"/services"}>Services</Link>
      </li>
      <li>
        <Link href={"/aesthetician"}>Aesthetician</Link>
      </li>
      <li>
        <Link href={"/branches"}>Branches</Link>
      </li>
      <li>
        <Link href={"/about-us"}>About Us</Link>
      </li>
      <li>
        <Link href={"/contact-us"}>Contact Us</Link>
      </li>
    </ul>
  );
};

export default Navbar;
