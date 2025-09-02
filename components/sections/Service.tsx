"use client"

import React, { Suspense } from "react";
import { tinos } from "../fonts/fonts";
import SkeletonCard from "../SkeletonCard";
import ServiceList from "../ServiceList";

const Service = () => {
  return (
    <section className="mt-[70px] bg-white my-5">
      <div className="">
        <h3
          className={`${tinos.className} text-4xl font-bold text-center mb-2`}
        >
          Top Services
        </h3>
        <p className={`text-[#7C7C7C] text-center text-sm`}>
          Simply browse through our extensive list of trusted aestheticians,
          <br />
          schedule your appointment hassle-free.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-3 gap-4 justify-center mt-10 w-full sm:mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        <ServiceList action={false} />
      </Suspense>
    </section>
  );
};

export default Service;
