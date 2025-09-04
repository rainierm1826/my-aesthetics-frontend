"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropDownProps } from "@/lib/types/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useServiceName } from "@/hooks/useServiceName";
import { ServiceName } from "@/lib/types/service-types";

interface DropDownServiceProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
    branchId?:string

}

const DropDownService = ({
  onValueChange,
  value,
  placeholder = "Select service",
  includeAllOption = false,
  useUrlParams = false,
  branchId
}: DropDownServiceProps) => {
  const { data, isLoading, error } = useServiceName(branchId);
  
  console.log(branchId, "from dropdown service")

  const services: ServiceName[] = data?.service ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentService = useUrlParams
    ? searchParams.get("service") || (includeAllOption ? "all" : "")
    : value || "";

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

        if (newValue === "all" && includeAllOption) {
          params.delete("service");
        } else {
          params.set("service", newValue);
        }
        params.delete("page");

        // More direct URL construction
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
      }

      onValueChange?.(newValue);
    },
    [
      useUrlParams,
      searchParams,
      pathname,
      router,
      includeAllOption,
      onValueChange,
    ]
  );

  // Handle loading state
  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading services..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__service" disabled>
            Loading...
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading services" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__error" disabled>
            Failed to load services
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentService} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {includeAllOption && (
          <SelectItem value="all">All services</SelectItem>
        )}

        {services.length === 0 ? (
          <SelectItem value="__no_service" disabled>
            No service available
          </SelectItem>
        ) : (
          services.map((s) => (
            <SelectItem
              key={s.service_id}
              value={s.service_id}
            >
              {s.service_name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default DropDownService;
