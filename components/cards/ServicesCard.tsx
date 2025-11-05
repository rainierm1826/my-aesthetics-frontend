import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import BookNowButton from "../buttons/BookNowButton";
import { RatingStar } from "../RatingStar";
import { Badge } from "../ui/badge";
import { Tags, Clock } from "lucide-react";
import Link from "next/link";

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
  duration,
  service_id,
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
  duration: number;
  category: string;
  service_id: string;
}) => {
  return (
    <Link href={`/services/${service_id}`} passHref>
      <Card className="cursor-pointer pt-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full">
        <CardContent className="p-0 w-full">
          {/* Image Container */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              alt="Ombre Shading Eyebrows service"
              src={image ?? "/fallbackImage.jpg"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Discount Badge */}
            {isSale && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Tags className="w-2.5 h-2.5" />
                <span>
                  {discountType === "percentage"
                    ? `${discount}% OFF`
                    : `₱${discount} OFF`}
                </span>
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2 space-y-1.5">
            {/* Service Name */}
            <div className="space-y-0.5">
              <h3 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2">
                {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
              </h3>
              <p className="text-[10px] text-primary">{category}</p>
            </div>

            {/* Rating and Duration */}
            <div className="flex items-center justify-between gap-2">
              <RatingStar rating={rating} />
              <div className="flex items-center gap-0.5 text-gray-600">
                <Clock className="w-3 h-3" />
                <span className="text-[10px]">{duration} min</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-sm font-bold text-gray-900">{`₱${discountedPrice.toLocaleString()}`}</span>
              {isSale && (
                <>
                  <span className="text-[10px] text-gray-400 line-through">{`₱${price.toLocaleString()}`}</span>
                  <span className="text-[9px] text-green-600 font-medium bg-green-50 px-1 py-0.5 rounded whitespace-nowrap">
                    Save ₱{(price - discountedPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>

        {/* Action Section */}
        {action && (
          <div className="px-2 pb-2">
            <BookNowButton size="w-full" />
          </div>
        )}
      </Card>
    </Link>
  );
};

export default ServicesCard;
