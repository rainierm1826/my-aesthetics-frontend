import React from "react";
import { Tinos } from "next/font/google";
import Link from "next/link";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Logo = () => {
  return (
    <Link
      href={"/"}
      className={`${tinos.className} text-4xl font-bold flex items-center text-[#BDA658]`}
    >
      MY<span className="text-lg">Aesthetics</span>
    </Link>
  );
};

export default Logo;
