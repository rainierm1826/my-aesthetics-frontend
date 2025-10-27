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
    url: "/manage/settings",
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
        url: "/manage/dashboard/appointments",
      },
      {
        title: "Sales",
        url: "/manage/dashboard/sales",
      },
    ],
  },
];

export const managements = [
  {
    title: "Appointments",
    url: "/manage/appointments",
    icon: Calendar,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Customers",
    url: "/manage/customer",
    icon: ShieldUser,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Aesthetician",
    url: "/manage/aesthetician",
    icon: VenetianMask,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Service",
    url: "/manage/service",
    icon: Brush,
    rolesAllowed: ["owner", "admin"],
  },
  {
    title: "Branch",
    url: "/manage/branch",
    icon: MapPin,
    rolesAllowed: ["owner"],
  },
  {
    title: "Administrator",
    url: "/manage/admin",
    icon: ShieldUser,
    rolesAllowed: ["owner"],
  },
  {
    title: "Voucher",
    url: "/manage/voucher",
    icon: Gift,
    rolesAllowed: ["owner", "admin"],
  },
];
