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
import { useAestheticianName } from "@/hooks/useAestheticianName";
import { AestheticianName } from "@/lib/types/aesthetician-types";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/provider/store/authStore";

interface DropDownAestheticianProps
  extends Omit<DropDownProps, "value" | "onValueChange"> {
  onValueChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  useUrlParams?: boolean;
  branchId: string;
}

const DropDownAesthetician = ({
  onValueChange,
  value,
  placeholder = "Select aesthetician",
  includeAllOption = false,
  useUrlParams = false,
  branchId,
}: DropDownAestheticianProps) => {
  const { access_token } = useAuthStore();
  const { data, isLoading, error } = useAestheticianName({
    branchId,
    token: access_token || "",
  });

  const aestheticians: AestheticianName[] = data?.aesthetician ?? [];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentAesthetician = useUrlParams
    ? searchParams.get("aesthetician") || (includeAllOption ? "all" : "")
    : value || "";

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (useUrlParams) {
        const params = new URLSearchParams(searchParams);

        if (newValue === "all" && includeAllOption) {
          params.delete("aesthetician");
        } else {
          params.set("aesthetician", newValue);
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

  // Get display label for selected aesthetician
  const getDisplayLabel = () => {
    if (!currentAesthetician) return placeholder;
    if (currentAesthetician === "all") return "All Aesthetician";

    const selected = aestheticians.find(
      (a) => a.aesthetician_id === currentAesthetician
    );
    return selected
      ? `${selected.first_name} ${selected.middle_initial}. ${selected.last_name}`
      : placeholder;
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Loading aestheticians...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Error loading aesthetician
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
        side="bottom"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Search aesthetician..." className="h-9" />
          <CommandList>
            <CommandEmpty>No aesthetician found.</CommandEmpty>
            <CommandGroup>
              {includeAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    handleValueChange("all");
                    setOpen(false);
                  }}
                >
                  All Aesthetician
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentAesthetician === "all"
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}

              {aestheticians.length === 0 ? (
                <CommandItem disabled>No aesthetician available</CommandItem>
              ) : (
                aestheticians.map((a) => {
                  const fullName = `${a.first_name} ${a.middle_initial}. ${a.last_name}`;
                  return (
                    <CommandItem
                      key={a.aesthetician_id}
                      value={fullName}
                      onSelect={() => {
                        handleValueChange(a.aesthetician_id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {fullName}
                        {a.experience === "pro" && (
                          <Badge className="rounded-full bg-green-50 text-green-500 text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentAesthetician === a.aesthetician_id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropDownAesthetician;