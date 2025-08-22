"use client";

import React from "react";
import AestheticianCard from "./AestheticianCard";
import { Aesthetician } from "@/lib/aesthetician-types";
import { useAestheticians } from "@/hooks/useAestheticians";

const AestheticianList = () => {
  const { data } = useAestheticians();
  const aestheticians: Aesthetician[] = data?.aesthetician ?? [];

  return (
    <div className="flex justify-center flex-col w-full mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 justify-center px-4 gap-3">
        {aestheticians.map((aesthetician) => (
          <AestheticianCard
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
