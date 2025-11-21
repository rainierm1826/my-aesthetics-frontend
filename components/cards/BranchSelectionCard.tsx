import React from "react";
import WaitingList from "@/components/WaitingList";
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
      className={`pt-0 overflow-hidden transition-all duration-200 flex flex-col h-full ${
        isOpen
          ? `cursor-pointer hover:shadow-md ${
              isSelected
                ? "ring-2 ring-primary shadow-md"
                : "hover:ring-1 hover:ring-primary/50"}
            `
          : "opacity-60 cursor-not-allowed"
      }`}
      style={{ minHeight: 0 }}
    >
      {/* Branch Image - now takes full available height at the top */}
      <div
        className="relative w-full aspect-[16/9] min-h-[160px] max-h-64 flex-shrink-0"
        onClick={() => isOpen && onClick?.(branch)}
        style={{ cursor: isOpen ? 'pointer' : 'not-allowed' }}
      >
        <Image
          src={branch.image ?? "/fallbackImage.jpg"}
          alt={branch.branch_name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
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
      <CardContent className="p-3 space-y-2 flex flex-col flex-1">
        {/* Branch Name */}
        <div className="flex justify-between item-center">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
            {branch.branch_name}
          </h3>
        <WaitingList selectedBranchId={branch.branch_id} />
        </div>
        
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
