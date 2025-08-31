import React from "react";
import Link from "next/link";
import { tinos } from "./fonts/fonts";

const Logo = ({mainSize, size, href}:{mainSize:string, size: string, href:string}) => {
  return (
    <Link
      href={href}
      className={`${tinos.className} ${mainSize} font-bold flex items-center text-[#BDA658]`}
    >
      MY<span className={`${size}`}>Aesthetics</span>
    </Link>
  );
};

export default Logo;
