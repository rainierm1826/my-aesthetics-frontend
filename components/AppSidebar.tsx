"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { general, analytics, managements } from "@/lib/constants";
import { ChevronRight, Plus } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import { useAuthStore } from "@/provider/store/authStore";
import { useMemo } from "react";
import { useUserStore } from "@/provider/store/userStore";

export function AppSidebar() {
  const pathname = usePathname();
  const { auth } = useAuthStore();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col">
        <SidebarHeader className="flex items-center">
          <Logo mainSize="text-4xl" size="text-xl" href="#" />
        </SidebarHeader>
        {auth?.role === "owner" && <AnalyticsGroup pathname={pathname} />}
        <ManagementGroup pathname={pathname} userRole={auth?.role || "owner"} />
        <GeneralGroup pathname={pathname} />
        <SFooter />
      </SidebarContent>
    </Sidebar>
  );
}

const AnalyticsGroup = ({ pathname }: { pathname: string }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarGroupContent>
        {analytics.map((item) => (
          <div key={item.title}>
            <Collapsible
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 flex flex-col gap-2">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.url}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      pathname === subItem.url ? "bg-muted" : ""
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

interface ManagementGroupProps {
  pathname: string;
  userRole: "admin" | "owner" | "customer";
}

const ManagementGroup = ({ pathname, userRole }: ManagementGroupProps) => {
  const filteredManagements = useMemo(
    () => managements.filter((item) => item.rolesAllowed.includes(userRole)),
    [userRole]
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredManagements.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`px-2 py-1 rounded transition-colors ${
                    pathname === item.url ? "bg-muted" : ""
                  }`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const GeneralGroup = ({ pathname }: { pathname: string }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {general.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`px-2 py-1 rounded transition-colors ${
                    pathname === item.url ? "bg-muted" : ""
                  }`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SFooter = () => {
  const { auth } = useAuthStore();
  const { user } = useUserStore();


  return (
    <SidebarFooter className="mt-auto">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-3">
                  <ProfilePicture
                    fallback={user?.first_name?.charAt(0)}
                    image={user?.image || "https://github.com/shadcn.png"}
                  />
                  <div className="space-y-0.5 ">
                    <p className="text-xs font-semibold whitespace-nowrap">
                      {user?.first_name} {user?.middle_initial}.{" "}
                      {user?.last_name}
                    </p>
                    <p className="text-xs text-[#7C7C7C] text-left">
                      {auth?.role
                        ? auth.role.charAt(0).toUpperCase() + auth.role.slice(1)
                        : ""}
                    </p>
                  </div>
                  <div className="flex justify-end w-full">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[200px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={"/owner/profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
