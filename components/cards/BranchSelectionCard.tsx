import React from "react";
import { MapPin } from "lucide-react";
import { RatingStar } from "../RatingStar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Branch } from "@/lib/types/branch-types";
import { Address } from "@/lib/types/types";

interface BranchSelectionCardProps {
  branch: Branch;
  isSelected?: boolean;
  onClick?: (branch: Branch) => void;
}

const BranchSelectionCard: React.FC<BranchSelectionCardProps> = ({
  branch,
  isSelected = false,
  onClick,
}) => {
  const formatAddress = (address: Address): string => {
    const parts = [
      address.province,
      address.city,
      address.barangay,
      address.lot,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const isOpen = branch.status === "active";

  return (
    <Card
      className={`pt-0 overflow-hidden transition-all duration-200 ${
        isOpen
          ? `cursor-pointer hover:shadow-md ${
              isSelected
                ? "ring-2 ring-primary shadow-md"
                : "hover:ring-1 hover:ring-primary/50"
            }`
          : "opacity-60 cursor-not-allowed"
      }`}
      onClick={() => isOpen && onClick?.(branch)}
    >
      {/* Branch Image */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={branch.image ?? "/fallbackImage.jpg"}
          alt={branch.branch_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={isOpen ? "default" : "secondary"}
            className={`text-xs ${isOpen ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Branch Name */}
        <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
          {branch.branch_name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <RatingStar rating={branch.avarage_rate} max={5} />
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">{formatAddress(branch.address)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchSelectionCard;
