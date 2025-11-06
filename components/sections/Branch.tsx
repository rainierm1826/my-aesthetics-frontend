import React, { Suspense } from "react";
import BranchList from "../lists/BranchList";
import SkeletonCard from "../skeletons/SkeletonCard";
import { tinos } from "../fonts/fonts";

const Branch = () => {
  return (
    <section className="bg-white my-5 ">
      <div className="flex justify-center flex-col w-full mx-auto">
        <h3
          className={`${tinos.className} text-4xl font-bold text-center mb-2`}
        >
          Top Rated Branches
        </h3>
        <p className={`text-[#7C7C7C] text-center text-sm`}>
          Simply browse through our extensive list of trusted aestheticians,
          <br />
          schedule your appointment hassle-free.
        </p>
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-center w-full mx-auto max-w-7xl px-2 sm:px-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            }
          >
            <BranchList action={false} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Branch;
