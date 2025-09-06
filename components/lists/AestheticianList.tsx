"use client";

import React from "react";
import AestheticianCard from "../cards/AestheticianCard";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import { useAestheticians } from "@/hooks/useAestheticians";
import SkeletonCard from "../skeletons/SkeletonCard";
import SearchInput from "../SearchInput";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownAvailability from "../selects/DropDownAvailability";
import DropDownSex from "../selects/DropDownSex";
import DropDownExperience from "../selects/DropDownExperience";

const AestheticianList = ({ action }: { action: boolean }) => {
  const { data, isFetching } = useAestheticians();
  const aestheticians: Aesthetician[] = data?.aesthetician ?? [];

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
        {isFetching
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : aestheticians.map((aesthetician) => (
              <AestheticianCard
                aesthetician_id={aesthetician.aesthetician_id}
                action
                availability={aesthetician.availability}
                firstName={aesthetician.first_name}
                lastName={aesthetician.last_name}
                middleInitial={aesthetician.middle_initial}
                experience={aesthetician.experience}
                image={aesthetician.image}
                rating={aesthetician.average_rate}
                key={aesthetician.aesthetician_id}
              />
            ))}
      </div>
    </div>
  );
};

export default AestheticianList;
