import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { RatingStar } from "./RatingStar";
import { Clock, MapPin, Phone } from "lucide-react";
import BookNowButton from "./BookNowButton";
import clsx from "clsx";

const BranchCard = ({
  className,
  action,
}: {
  className?: string;
  action?: boolean;
}) => {
  return (
    <Card
      className={clsx(
        "pt-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col",
        className
      )}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Branch Image Container - Reduced height */}
        <div className="relative w-full aspect-[16/8] flex-shrink-0 overflow-hidden">
          <Image
            alt="Glow Beauty Studio - Lipa Branch"
            src="/branch1.webp"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            Open Now
          </div>
        </div>

        {/* Content Section - Flex grow to fill remaining space */}
        <div className="p-3 space-y-2 flex-grow flex flex-col">
          {/* Branch Name & Rating */}
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              MY Aesthetics Brow Studio
            </h3>
            <p className="text-xs font-medium text-primary">
              Batangas City Branch
            </p>

            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-1 w-full">
                <RatingStar rating={5} />
                <span className="font-semibold text-gray-900 text-sm">4.7</span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                (156 reviews)
              </span>
              <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                Top Rated
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600 leading-relaxed">
              123 JP Rizal Avenue, Poblacion
              <br />
              Lipa City, Batangas 4217
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">Open until 8:00 PM</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">(043) 123-4567</span>
          </div>

          {/* Features/Amenities */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              Parking
            </span>
            <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">
              WiFi
            </span>
            <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">
              AC
            </span>
          </div>

          {/* Spacer to push button to bottom */}
          {/* <div className="flex-grow"></div> */}

          {/* Action Section */}
          {action && (
            <div className="pt-1">
              <BookNowButton size="w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchCard;
