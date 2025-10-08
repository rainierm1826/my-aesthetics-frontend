"use client";

import React, { Suspense } from "react";
import { tinos } from "../fonts/fonts";
import SkeletonCard from "../skeletons/SkeletonCard";
import { useTopRatedServices } from "@/hooks/useTopRatedServices";
import { Service as ServiceProps } from "@/lib/types/service-types";
import ServicesCard from "../cards/ServicesCard";

const Service = () => {
  const { data, isFetching } = useTopRatedServices();
  const services: ServiceProps[] = data?.service ?? [];

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
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        <div className="flex justify-center w-full mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 justify-items-center max-w-7xl px-2 sm:px-4">
            {isFetching && !data
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : services.map((service) => (
                  <ServicesCard
                    key={service.service_id}
                    service_id={service.service_id}
                    category={service.category}
                    isSale={service.is_sale}
                    serviceName={service.service_name}
                    price={service.price}
                    discount={service.discount}
                    discountType={service.discount_type}
                    discountedPrice={service.discounted_price}
                    image={service.image}
                    rating={service.avarage_rate}
                  />
                ))}
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default Service;
