"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const DataTableEntries = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLimit = Number(searchParams.get("limit") ?? "10");

  const onChange = useCallback(
    (val: string) => {
      const nextLimit = Number(val) || 10;
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");
      params.set("limit", String(nextLimit));

      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, searchParams, router]
  );

  return (
    <Select value={String(currentLimit)} onValueChange={onChange}>
      <SelectTrigger className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] border-0 focus-visible:border-0">
        <SelectValue placeholder="Show entries" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="10">10 Entries</SelectItem>
        <SelectItem value="15">15 Entries</SelectItem>
        <SelectItem value="20">20 Entries</SelectItem>
        <SelectItem value="25">25 Entries</SelectItem>
        <SelectItem value="30">30 Entries</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DataTableEntries;
