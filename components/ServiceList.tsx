"use client";

import React from "react";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/lib/service-types";
import ServicesCard from "./ServicesCard";
import SkeletonCard from "./SkeletonCard";
import DropDownServiceCategory from "./DropDownServiceCategory";
import DropDownBranch from "./DropDownBranch";
import SearchInput from "./SearchInput";

const ServiceList = ({ action }: { action: boolean }) => {
  const { data, isFetching } = useServices();
  const services: Service[] = data?.service ?? [];

  return (
    <>
      {/* Actions Section */}
      {action && (
        <div className="max-w-4xl mx-auto">
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
      </div>
    </>
  );
};

export default ServiceList;
