import {
  Calendar,
  ChartNoAxesCombined,
  ShieldUser,
  Settings,
  VenetianMask,
  MapPin,
  Brush,
  Gift,
} from "lucide-react";

export const general = [
  {
    title: "Settings",
    url: "/owner/settings",
    icon: Settings,
  },
];

export const analytics = [
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

export const managements = [
  {
    title: "Appointments",
    url: "/owner/manage-appointments",
    icon: Calendar,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Aesthetician",
    url: "/owner/manage-aesthetician",
    icon: VenetianMask,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Service",
    url: "/owner/manage-service",
    icon: Brush,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Branch",
    url: "/owner/manage-branch",
    icon: MapPin,
    rolesAllowed: ["owner"],
  },
  {
    title: "Administrator",
    url: "/owner/manage-admin",
    icon: ShieldUser,
    rolesAllowed: ["owner"],
  },
  {
    title: "Voucher",
    url: "/owner/manage-voucher",
    icon: Gift,
    rolesAllowed: ["owner", "admin"],
  },
];
