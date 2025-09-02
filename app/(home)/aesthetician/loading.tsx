import { tinos } from "@/components/fonts/fonts";
import SkeletonCard from "@/components/skeletons/SkeletonCard";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1
          className={`${tinos.className} text-4xl font-bold text-gray-800 mb-4`}
        >
          Choose Your Aesthetician
        </h1>
        <p className="text-[#7C7C7C] text-sm max-w-2xl mx-auto">
          Simply browse through our extensive list of trusted aestheticians.
        </p>
      </div>
      <div className="grid grid-cols-1 mx-10 mt-10 md:grid-cols-4 justify-center px-4 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
