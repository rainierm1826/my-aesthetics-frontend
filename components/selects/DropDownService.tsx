"use client";

import React, { useCallback, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DropDownProps } from "@/lib/types/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useServiceName } from "@/hooks/useServiceName";
import { ServiceName } from "@/lib/types/service-types";
import { useAuthStore } from "@/provider/store/authStore";

interface DropDownServiceProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  branchId?: string;
}

const DropDownService = ({
  onValueChange,
  value,
  placeholder = "Select service",
  includeAllOption = false,
  useUrlParams = false,
  branchId,
}: DropDownServiceProps) => {
  const { access_token } = useAuthStore();
  const { data, isLoading, error } = useServiceName({
    branchId,
    token: access_token || "",
  });

  const services: ServiceName[] = data?.service ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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

  // Get display label for selected service
  const getDisplayLabel = () => {
    if (!currentService) return placeholder;
    if (currentService === "all") return "All services";

    const selected = services.find((s) => s.service_id === currentService);
    return selected ? selected.service_name : placeholder;
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Loading services...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Error loading services
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {getDisplayLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="end"
        side="bottom"
        sideOffset={4}
        collisionPadding={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Search service..." className="h-9" />
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup>
              {includeAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    handleValueChange("all");
                    setOpen(false);
                  }}
                >
                  All services
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentService === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}

              {services.length === 0 ? (
                <CommandItem disabled>No service available</CommandItem>
              ) : (
                services.map((s) => (
                  <CommandItem
                    key={s.service_id}
                    value={s.service_name}
                    onSelect={() => {
                      handleValueChange(s.service_id);
                      setOpen(false);
                    }}
                  >
                    {s.service_name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentService === s.service_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropDownService;