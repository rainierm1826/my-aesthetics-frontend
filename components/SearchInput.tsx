import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

const SearchInput = ({placeholder, size}:{placeholder:string, size:string}) => {
  return (
    <div className={`flex items-center ${size} border border-input px-2 rounded-sm`}>
      <Search />
      <Input
        placeholder={placeholder}
        className="w-full max-w-sm border-0 focus-visible:ring-0"
      />
    </div>
  );
};

export default SearchInput;
