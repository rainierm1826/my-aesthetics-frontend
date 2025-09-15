"use client";

import React, { useEffect, useRef } from "react";
import { Service } from "@/lib/types/service-types";
import ServicesCard from "../cards/ServicesCard";
import SkeletonCard from "../skeletons/SkeletonCard";
import DropDownServiceCategory from "../selects/DropDownServiceCategory";
import DropDownBranch from "../selects/DropDownBranch";
import SearchInput from "../SearchInput";
import { useInfiniteServices } from "@/hooks/useInfiniteServices";

const ServiceList = ({ action }: { action: boolean }) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteServices();
  const services: Service[] = data?.pages.flatMap((page) => page.service) ?? [];
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const currentLoader = loader.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="bg-[#fffcf9]">
      {/* Actions Section */}
      {action && (
        <div className="max-w-4xl mx-auto ">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <DropDownBranch useUrlParams={true} includeAllOption={true} />
              <DropDownServiceCategory
                useUrlParams={true}
                includeAllOption={true}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center flex-col w-full mx-auto sm:w-3/4">
        <div className="grid grid-cols-1 place-items-center sm:grid-cols-3 gap-4 justify-center mt-10 w-full sm:mx-auto">
          {isFetching
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : services.map((service) => (
                <ServicesCard
                  service_id={service.service_id}
                  action
                  key={service.service_id}
                  category={service.category}
                  isSale={service.is_sale}
                  serviceName={service.service_name}
                  price={service.price}
                  discount={service.discount}
                  discountType={service.discount_type}
                  discountedPrice={service.discounted_price}
                  image={service.image}
                  rating={service.average_rate}
                />
              ))}
        </div>
        <div ref={loader} className="h-10 flex justify-center items-center">
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>
      </div>
    </main>
  );
};

export default ServiceList;
