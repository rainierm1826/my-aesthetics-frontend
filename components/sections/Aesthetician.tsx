import React, { Suspense } from "react";
import AestheticianList from "../lists/AestheticianList";
import SkeletonCard from "../skeletons/SkeletonCard";
import { tinos } from "../fonts/fonts";

const Aesthetician = () => {
  return (
    <section className="bg-gradient-to-tr from-[#fdfaf0] to-white my-10 py-5">
      <div className="flex justify-center flex-col w-full mx-auto mb-5">
        <h3
          className={`${tinos.className} text-4xl font-bold text-center mb-2`}
        >
          Choose Your Aesthetician
        </h3>
        <p className={`text-[#7C7C7C] text-center text-sm mb-5`}>
          Simply browse through our extensive list of trusted aestheticians.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 mx-10 md:grid-cols-4 justify-center px-4 gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        <AestheticianList action={false} />
      </Suspense>
    </section>
  );
};

export default Aesthetician;
