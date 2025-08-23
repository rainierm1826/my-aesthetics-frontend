import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import BookNowButton from "./BookNowButton";
import { RatingStar } from "./RatingStar";
import { Badge } from "./ui/badge";
import { Tags } from "lucide-react";

const ServicesCard = ({
  action,
  image,
  discountType,
  discount,
  serviceName,
  price,
  discountedPrice,
  rating,
  isSale,
  category,
}: {
  action?: boolean;
  image: string;
  discountType: string;
  discount: number;
  serviceName: string;
  price: number;
  discountedPrice: number;
  rating: number;
  isSale: boolean;
  category: string;
}) => {
  return (
    <Card className="pt-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0 min-w-[300px]">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            alt="Ombre Shading Eyebrows service"
            src={image}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Discount Badge */}
          {isSale && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <span>
                <Tags className="w-4 h-4" />
              </span>
              {/* 20% OFF */}
              {discountType === "percentage" ? `${discount}%` : `₱${discount}`}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Service Name */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
            </h3>
            <p className="text-sm text-primary">{category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStar rating={rating} />
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{`₱${discountedPrice.toLocaleString()}`}</span>
            <span className="text-sm text-gray-400 line-through">{`₱${price.toLocaleString()}`}</span>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              Save ₱{(price - discountedPrice).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Action Section */}
      {action && (
        <div className="px-4">
          <BookNowButton size="w-full" />
        </div>
      )}
    </Card>
  );
};

export default ServicesCard;
