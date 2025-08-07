"use client";

import {
  Calendar,
  ChartNoAxesCombined,
  ShieldUser,
  Settings,
  VenetianMask,
  MapPin,
  ChevronRight,
  Brush,
  ChevronUp,
  LogOut,
} from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ProfilePicture from "./ProfilePicture";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tinos } from "next/font/google";
import { Button } from "./ui/button";

const managements = [
  {
    title: "Appointments",
    url: "/owner/manage-appointments",
    icon: Calendar,
  },
  {
    title: "Aesthetician",
    url: "/owner/manage-aesthetician",
    icon: VenetianMask,
  },
  {
    title: "Service",
    url: "/owner/manage-service",
    icon: Brush,
  },
  {
    title: "Branch",
    url: "/owner/manage-branch",
    icon: MapPin,
  },
  {
    title: "Admin",
    url: "/owner/manage-admin",
    icon: ShieldUser,
  },
];

const general = [
  {
    title: "Settings",
    url: "/owner/settings",
    icon: Settings,
  },
];

const analytics = [
  {
    title: "Dashboard",
    icon: ChartNoAxesCombined,
    isActive: true,
    items: [
      {
        title: "Appointments",
        url: "/owner/dashboard/appointments",
      },
      {
        title: "Sales",
        url: "/owner/dashboard/sales",
      },
    ],
  },
];

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="flex flex-col min-h-screen">
        <SidebarHeader className="flex items-center">
          <Logo mainSize="text-4xl" size="text-xl" href="#" />
        </SidebarHeader>
        <AnalyticsGroup pathname={pathname} />
        <ManagementGroup pathname={pathname} />
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

const ManagementGroup = ({ pathname }: { pathname: string }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {managements.map((item) => (
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
  return (
    <SidebarFooter className="mt-auto">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="text-red-400">
            <Link href={"/"}>
              <LogOut />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
