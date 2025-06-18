"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { nav_links } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="p-4 container mx-auto flex justify-between items-center h-[60px]">
      {/* logo */}
      <div>
        <Logo />
      </div>

      <ul className="flex items-center gap-8 text-sm text-[#7C7C7C]">
        {nav_links.map((link, index) => (
          <Link href={link.href} key={index}>
            <li
              className={`${
                link.label.toLowerCase() == pathname ? "text-[#BDA658]" : ""
              }`}
            >
              {link.label}
            </li>
          </Link>
        ))}
      </ul>

      {/* buttons */}

      <div className="flex items-center gap-5">
        <Button className="border-[#BDA658]" variant={"outline"}>
          Sign Up
        </Button>
        <Button className="bg-[#BDA658]">Book Now</Button>
      </div>
    </header>
  );
}
