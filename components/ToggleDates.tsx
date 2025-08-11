import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
const ToggleDates = () => {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem
        value="a"
        className="data-[state=on]:bg-[#FBF9F2] text-[#7C7C7C]"
      >
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem
        value="b"
        className="data-[state=on]:bg-[#FBF9F2] text-[#7C7C7C]"
      >
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem
        value="c"
        className="data-[state=on]:bg-[#FBF9F2] text-[#7C7C7C]"
      >
        Yearly
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ToggleDates;
