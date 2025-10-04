"use client";

import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import NavbarSheet from "./NavbarSheet";
import DropDownMenuCustomerProfile from "../dropdowns/DropDownMenuCustomerProfile";
import { useAuthStore } from "@/provider/store/authStore";
import DropDownMenuOwnerProfile from "../dropdowns/DropDownMenuManagementProfile";
import { usePathname } from "next/navigation";


const Navbar = () => {
  const { isAuth, auth, isAuthLoading } = useAuthStore();

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

        <div className="hidden md:flex">
          {isAuthLoading ? (
            <p>Loading...</p>
          ) : isAuth && auth?.role !== "customer" ? (
            <DropDownMenuOwnerProfile />
          ) : (
            <DropDownMenuCustomerProfile />
          )}
        </div>

        <div className="flex md:hidden">
          <NavbarSheet />
        </div>
      </nav>
    </header>
  );
};


const NavLinks = () => {
  const pathname = usePathname();

  const links = [
    { href: "/services", label: "Services" },
    { href: "/aesthetician", label: "Aesthetician" },
    { href: "/branches", label: "Branches" },
    { href: "/about-us", label: "About Us" },
  ];

  return (
    <ul className="md:flex gap-10 text-sm hidden">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors ${
                isActive
                  ? "text-[#BDA658] font-semibold border-b-2 border-[#BDA658]"
                  : "text-[#7C7C7C] hover:text-[#BDA658]"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Navbar;
