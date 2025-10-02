import React from "react";
import { RatingStar } from "../RatingStar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Aesthetician } from "@/lib/types/aesthetician-types";

interface AestheticianSelectionCardProps {
  aesthetician: Aesthetician;
  isSelected?: boolean;
  onClick?: (aesthetician: Aesthetician) => void;
}

const AestheticianSelectionCard: React.FC<AestheticianSelectionCardProps> = ({
  aesthetician,
  isSelected = false,
  onClick,
}) => {
  const fullName =
    `${aesthetician.first_name} ${aesthetician.middle_initial ? aesthetician.middle_initial + "." : ""} ${aesthetician.last_name}`.trim();

  const getAvailabilityConfig = (availability: string) => {
    switch (availability) {
      case "available":
        return { label: "Available", color: "bg-green-500 hover:bg-green-600" };
      case "working":
        return { label: "Working", color: "bg-blue-500 hover:bg-blue-600" };
      case "off-duty":
        return { label: "Off Duty", color: "bg-gray-500 hover:bg-gray-600" };
      case "on-break":
        return {
          label: "On Break",
          color: "bg-yellow-500 hover:bg-yellow-600",
        };
      default:
        return { label: "Unknown", color: "bg-gray-400" };
    }
  };

  const availabilityConfig = getAvailabilityConfig(aesthetician.availability);

  return (
    <Card
      className={`pt-0 cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:ring-1 hover:ring-primary/50"
      }`}
      onClick={() => onClick?.(aesthetician)}
    >
      {/* Aesthetician Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <Image
          src={aesthetician.image ?? "/fallbackImage.jpg"}
          alt={fullName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs ${availabilityConfig.color} text-white`}>
            {availabilityConfig.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Name */}
        <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
          {fullName}
        </h3>
        <div className="flex justify-between items-center">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <RatingStar rating={aesthetician.average_rate} max={5} />
          </div>

          {/* Experience */}
          {aesthetician.experience && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div
                className={`h-4 w-4 ${aesthetician.experience === "pro" ? "bg-green-300" : "bg-gray-300"} rounded-full`}
              />
              <span className="capitalize">{aesthetician.experience}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AestheticianSelectionCard;
