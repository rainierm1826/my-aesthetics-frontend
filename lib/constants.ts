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
    title: "Administrator",
    url: "/owner/manage-admin",
    icon: ShieldUser,
  },
  {
    title: "Voucher",
    url: "/owner/manage-voucher",
    icon: Gift,
  },
];
