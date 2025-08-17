import { getAllBranches } from "@/api/branch";
import BranchCard from "@/components/BranchCard";
import SearchInput from "@/components/SearchInput";

import { Tinos } from "next/font/google";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default async function BranchesPage() {
  const branches = await getAllBranches();
  return (
    <main>
      <div className="container mx-auto py-12 ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`${tinos.className} text-4xl font-bold text-gray-800 mb-4`}
          >
            Top Rated Branches
          </h1>
          <p className="text-[#7C7C7C] text-sm max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted aestheticians,
            <br />
            schedule your appointment hassle-free.
          </p>
        </div>

        {/* Actions Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 px-4">
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
    </main>
  );
}
