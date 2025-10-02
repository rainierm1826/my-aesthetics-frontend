"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Service } from "@/lib/types/service-types";
import ServiceSelectionCard from "@/components/cards/ServiceSelectionCard";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import { useInfiniteServices } from "@/hooks/useInfiniteServices";

const ServiceSelectionList: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteServices();
  const services: Service[] = data?.pages.flatMap((page) => page.service) ?? [];
  const loader = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log("Fetching next page...");
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

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Failed to load services</p>
          <p className="text-sm text-red-500 mt-1">
            Please refresh the page or try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>Select Service</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : services.length > 0 ? (
          services.map((service) => (
            <ServiceSelectionCard
              key={service.service_id}
              service={service}
              isSelected={selectedService?.service_id === service.service_id}
              onClick={handleServiceSelect}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No services available at the moment</p>
          </div>
        )}
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

export default ServiceSelectionList;
