import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

const SearchInput = ({placeholder}:{placeholder:string}) => {
  return (
    <div className="flex items-center w-1/2 border border-[#7C7C7C] px-2 rounded-lg">
      <Search />
      <Input
        placeholder={placeholder}
        className="w-full max-w-sm border-0 focus-visible:ring-0"
      />
    </div>
  );
};

export default SearchInput;
