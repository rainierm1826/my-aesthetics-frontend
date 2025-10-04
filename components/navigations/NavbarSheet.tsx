"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import Logo from "../Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/provider/store/authStore";
import DropDownMenuCustomerProfile from "../dropdowns/DropDownMenuCustomerProfile";
import DropDownMenuOwnerProfile from "../dropdowns/DropDownMenuManagementProfile";
import { useState } from "react";

export default function NavbarSheet() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuth, auth, isAuthLoading } = useAuthStore();

  const links = [
    { href: "/services", label: "Services" },
    { href: "/aesthetician", label: "Aesthetician" },
    { href: "/branches", label: "Branches" },
    { href: "/about-us", label: "About Us" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <AlignRight className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent className="flex flex-col w-[300px]">
        <SheetHeader className="mb-8">
          <SheetTitle>
            <Logo mainSize="text-4xl" size="text-xl" href="/" />
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6 flex-1">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base transition-colors py-2 ${
                  isActive
                    ? "text-[#BDA658] font-semibold border-l-4 border-[#BDA658] pl-4"
                    : "text-[#7C7C7C] hover:text-[#BDA658] pl-4"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto pt-6 border-t">
          {isAuthLoading ? (
            <p className="text-center text-sm text-[#7C7C7C]">Loading...</p>
          ) : isAuth && auth?.role !== "customer" ? (
            <DropDownMenuOwnerProfile />
          ) : (
            <DropDownMenuCustomerProfile />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
