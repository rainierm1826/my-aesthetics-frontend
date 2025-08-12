import React from "react";
import AestheticianCard from "./AestheticianCard";

import { Tinos } from "next/font/google";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const AestheticianList = () => {
  return (
    <div className="flex justify-center flex-col w-full mx-auto">
      <h3 className={`${tinos.className} text-4xl font-bold text-center mb-2`}>
        Choose Your Aesthetician
      </h3>
      <p className={`text-[#7C7C7C] text-center text-sm`}>
        Simply browse through our extensive list of trusted aestheticians.
      </p>
      <div className="flex flex-wrap flex-1 gap-8 justify-center mt-10">
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
        <AestheticianCard />
      </div>
    </div>
  );
};

export default AestheticianList;
