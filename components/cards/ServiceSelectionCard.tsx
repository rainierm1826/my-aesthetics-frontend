import React from "react";
import { RatingStar } from "../RatingStar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Service } from "@/lib/types/service-types";
import { formatCurrency } from "@/lib/function";

interface ServiceSelectionCardProps {
  service: Service;
  isSelected?: boolean;
  onClick?: (service: Service) => void;
}

const ServiceSelectionCard: React.FC<ServiceSelectionCardProps> = ({
  service,
  isSelected = false,
  onClick,
}) => {
  const hasDiscount = service.is_sale && service.discount > 0;
    console.log(service)
  return (
    <Card
      className={`pt-0 cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:ring-1 hover:ring-primary/50"
      }`}
      onClick={() => onClick?.(service)}
    >
      {/* Service Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <Image
          src={service.image ?? "/fallbackImage.jpg"}
          alt={service.service_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold">
              {service.discount_type === "percentage"
                ? `${service.discount}% OFF`
                : `₱${service.discount} OFF`}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs bg-white/90">
            {service.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Service Name */}
        <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
          {service.service_name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <RatingStar rating={service.avarage_rate} max={5} />
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Price */}
        <div className="pt-2 border-t">
          {hasDiscount ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(service.discounted_price ?? 0)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(service.price ?? 0)}
                </span>
              </div>
              <p className="text-xs text-green-600 font-medium">
                You save {formatCurrency(service.price - service.discounted_price || 0)}
              </p>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              {formatCurrency(service.price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelectionCard;
