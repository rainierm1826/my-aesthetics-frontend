import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import BookNowButton from "./BookNowButton";
import { RatingStar } from "./RatingStar";
import { Badge } from "./ui/badge";
import { Tags } from "lucide-react";

const ServicesCard = () => {
  return (
    <Card className="group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            alt="Ombre Shading Eyebrows service"
            src="/services1.webp"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Discount Badge */}
          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <span>
              <Tags className="w-4 h-4" />
            </span>
            20% OFF
          </Badge>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Service Name */}
          <h3 className="font-semibold text-gray-900 text-base leading-tight">
            Ombre Shading Eyebrows
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStar rating={4} />
            <span className="text-xs text-gray-500">(124 reviews)</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₱6,400</span>
            <span className="text-sm text-gray-400 line-through">₱8,000</span>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              Save ₱1,600
            </span>
          </div>
        </div>
      </CardContent>

      {/* Action Section */}
      <div className="px-4">
        <BookNowButton size="w-full" />
      </div>
    </Card>
  );
};

export default ServicesCard;
