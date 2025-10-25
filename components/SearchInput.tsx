"use client";

import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchInput = ({
  placeholder,
  size,
}: {
  placeholder: string;
  size: string;
}) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${pathName}?${params.toString()}`);
  }, 300);

  return (
    <div
      className={`flex items-center ${size} border border-input px-2 rounded-sm`}
    >
      <Search />
      <Input
        placeholder={placeholder}
        className="w-full max-w-sm border-0 focus-visible:ring-0"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
};

export default SearchInput;
