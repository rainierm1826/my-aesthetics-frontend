"use client";

import React, { Suspense } from "react";
import SkeletonCard from "../skeletons/SkeletonCard";
import { tinos } from "../fonts/fonts";
import { useTopRatedAestheticians } from "@/hooks/useTopRatedAestheticians";
import { Aesthetician as AestheticianProps } from "@/lib/types/aesthetician-types";
import AestheticianCard from "../cards/AestheticianCard";

const Aesthetician = () => {
  const { data, isFetching } = useTopRatedAestheticians();
  const aestheticians: AestheticianProps[] = data?.aesthetician ?? [];
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
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        <div className="">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto px-2 w-full justify-center">
            {isFetching
              ? Array.from({ length: 10 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : aestheticians.map((aesthetician, index) => (
                  <AestheticianCard
                    aesthetician_id={aesthetician.aesthetician_id}
                    availability={aesthetician.availability}
                    firstName={aesthetician.first_name}
                    lastName={aesthetician.last_name}
                    middleInitial={aesthetician.middle_initial}
                    experience={aesthetician.experience}
                    image={aesthetician.image}
                    rating={aesthetician.average_rate}
                    key={index}
                  />
                ))}
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default Aesthetician;
