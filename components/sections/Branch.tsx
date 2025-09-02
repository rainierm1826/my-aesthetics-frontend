import React, { Suspense } from "react";
import BranchList from "../BranchList";
import SkeletonCard from "../SkeletonCard";
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
              <div className="grid grid-cols-1 mx-10 md:grid-cols-2 justify-center px-4 gap-3 max-w-4xl sm:mx-auto">
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
