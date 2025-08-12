import React from "react";
import BranchCard from "./BranchCard";

import { Tinos } from "next/font/google";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const BranchList = () => {
  return (
    <div className="flex justify-center flex-col w-full mx-auto">
      <h3 className={`${tinos.className} text-4xl font-bold text-center mb-2`}>
        Top Rated Branches
      </h3>
      <p className={`text-[#7C7C7C] text-center text-sm`}>
        Simply browse through our extensive list of trusted aestheticians,
        <br />
        schedule your appointment hassle-free.
      </p>
      <div className="flex flex-wrap flex-1 gap-8 justify-center mt-10">
        <BranchCard />
        <BranchCard />
        <BranchCard />
      </div>
    </div>
  );
};

export default BranchList;
