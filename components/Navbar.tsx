import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import SignUpButton from "./SignUpButton";
import BookNowButton from "./BookNowButton";
import NavbarSheet from "./NavbarSheet";

const Navbar = () => {
  return (
    <header className="container">
      <nav className="flex justify-between items-center h-[60px] px-4">
        {/* logo */}
        <div>
          <Logo mainSize="text-4xl" size="text-xl" href="/" />
        </div>

        {/* nav links */}
        <NavLinks />
        {/* buttons */}

        <div className="md:flex gap-3 hidden">
          <SignUpButton />
          <BookNowButton size="" />
        </div>

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
