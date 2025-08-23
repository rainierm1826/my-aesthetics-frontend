"use client";

import React from "react";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/lib/service-types";
import ServicesCard from "./ServicesCard";
import SkeletonCard from "./SkeletonCard";

const ServiceList = () => {
  const { data, isLoading } = useServices();
  const services: Service[] = data?.service ?? [];

  return (
    <div className="flex justify-center flex-col w-full mx-auto sm:w-3/4">
      
      <div className="grid grid-cols-1 place-items-center sm:grid-cols-3 gap-4 justify-center mt-10 w-full sm:mx-auto">
        {isLoading
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
  );
};

export default ServiceList;
