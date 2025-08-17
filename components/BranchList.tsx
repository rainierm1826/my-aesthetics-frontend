import React from "react";
import BranchCard from "./BranchCard";

import { Tinos } from "next/font/google";
import { getAllBranches } from "@/api/branch";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const BranchList = async () => {
  const branches = await getAllBranches();

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
        {branches.branch.map((branch) => (
          <BranchCard
            key={branch.branch_id}
            action
            branchName={branch.branch_name}
            image={branch.image}
            status={branch.status}
            barangay={branch.address.barangay}
            lot={branch.address.lot}
            city={branch.address.city}
            province={branch.address.province}
            rating={branch.avarage_rate}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchList;
