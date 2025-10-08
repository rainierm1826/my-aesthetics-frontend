import { tinos } from "@/components/fonts/fonts";
import SkeletonCard from "@/components/skeletons/SkeletonCard";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 ">
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

      <div className="flex justify-center flex-col w-full mx-auto sm:w-3/4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 justify-items-center max-w-7xl px-2 sm:px-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      </div>
    </div>
  );
}
