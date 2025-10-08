"use client";

import React, { useCallback, useEffect, useRef } from "react";
import AestheticianCard from "../cards/AestheticianCard";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import SkeletonCard from "../skeletons/SkeletonCard";
import SearchInput from "../SearchInput";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownAvailability from "../selects/DropDownAvailability";
import DropDownSex from "../selects/DropDownSex";
import DropDownExperience from "../selects/DropDownExperience";
import { useInfiniteAestheticians } from "@/hooks/useInfiniteAestheticians";

const AestheticianList = ({ action }: { action: boolean }) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteAestheticians();
  const aestheticians: Aesthetician[] =
    data?.pages.flatMap((page) => page.aesthetician) ?? [];
  const loader = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "20px",
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
  }, [handleIntersection]);

  return (
    <div className="flex justify-center flex-col w-full mx-auto bg-[#fffcf9]">
      {action && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput
                placeholder="Search by name..."
                size="w-3/4 md:w-full"
              />
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <DropDownBranch useUrlParams={true} includeAllOption={true} />
              <DropDownAvailability
                useUrlParams={true}
                includeAllOption={true}
              />
              <DropDownExperience useUrlParams={true} includeAllOption={true} />
              <DropDownSex useUrlParams={true} includeAllOption={true} />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 mx-10 md:grid-cols-4 justify-center px-4 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
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
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-4 border-gray-300 border-primary-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div ref={loader} className="my-10 flex items-center justify-center">
        {hasNextPage && !isFetchingNextPage && (
          <div className="text-gray-500">Scroll to load more...</div>
        )}
      </div>
    </div>
  );
};

export default AestheticianList;
