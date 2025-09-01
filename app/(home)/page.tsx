import { Suspense } from "react";
import AestheticianList from "@/components/AestheticianList";
import BranchList from "@/components/BranchList";
import ServiceList from "@/components/ServiceList";
import { tinos } from "@/components/fonts/fonts";
import SkeletonCard from "@/components/SkeletonCard";
import Hero from "@/components/section/Hero";

export default function Home() {
  return (
    <div className="container mx-auto">
      {/* hero section */}
      <Hero />

      {/* services */}
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
    </div>
  );
}
