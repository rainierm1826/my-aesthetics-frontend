import {
  Calendar,
  ChartNoAxesCombined,
  ShieldUser,
  Settings,
  VenetianMask
} from "lucide-react";

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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/owner/dashboard",
    icon: ChartNoAxesCombined,
  },
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
    title: "Admin",
    url: "/owner/manage-admin",
    icon: ShieldUser,
  },

  {
    title: "Settings",
    url: "/owner/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter></SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
