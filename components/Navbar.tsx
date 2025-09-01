"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";

import NavbarSheet from "./NavbarSheet";

import DropDownMenuCustomerProfile from "./DropDownMenuCustomerProfile";
import { useAuthStore } from "@/provider/store/authStore";
import DropDownMenuOwnerProfile from "./DropDownMenuOwnerProfile";

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

        {isAuthLoading ? (
          <p>Loading...</p>
        ) : isAuth && auth?.role !== "customer" ? (
          <DropDownMenuOwnerProfile />
        ) : (
          <DropDownMenuCustomerProfile />
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
