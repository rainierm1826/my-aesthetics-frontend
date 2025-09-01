"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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

const OwnerNavbar = ({ title }: { title: string }) => {
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
    <header className="flex h-(--header-height) container shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-2xl py-[11.5px] font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
};

export default OwnerNavbar;
