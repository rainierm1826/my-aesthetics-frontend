import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { RatingStar } from "../RatingStar";
import BookNowButton from "../buttons/BookNowButton";
import { AestheticianCardProps } from "@/lib/types/aesthetician-types";
import Link from "next/link";

const AestheticianCard = ({
  action,
  image,
  experience,
  firstName,
  lastName,
  middleInitial,
  rating,
  availability,
  aesthetician_id,
}: AestheticianCardProps) => {
  return (
    <Link href={`/aesthetician/${aesthetician_id}`} passHref>
      <Card className="cursor-pointer py-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col w-[200px]">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Profile Image Container */}
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              alt={firstName}
              src={image ?? "/fallbackImage.jpg"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110 mt-5"
            />
            {/* Pro Badge */}
            <div
              className={`absolute top-6 right-2 bg-gradient-to-r text-white text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                experience == "pro"
                  ? "from-green-500 to-green-200"
                  : "from-gray-700 to gray-500"
              }`}
            >
              {experience.charAt(0).toUpperCase() + experience.slice(1) == "Pro"
                ? "Pro"
                : experience.charAt(0).toUpperCase() + experience.slice(1)}
            </div>
            {/* Availability Status */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  availability == "available"
                    ? "bg-green-500"
                    : availability == "working"
                      ? "bg-yellow-500"
                      : availability == "off-duty"
                        ? "bg-red-500"
                        : availability == "break"
                          ? "bg-orange-500"
                          : ""
                }`}
              ></div>
              <span className="text-[9px] font-medium text-gray-700">
                {availability.charAt(0).toUpperCase() + availability.slice(1)}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-2 space-y-1.5">
            {/* Name & Title */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-xs line-clamp-1">{`${firstName} ${middleInitial}. ${lastName}`}</h3>
              <p className="text-[10px] text-gray-500">Licensed Aesthetician</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-1">
              <RatingStar rating={rating} />
              <span className="text-[10px] font-medium text-gray-700">
                {rating}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Action Section */}
        {action && (
          <div className="px-2 pb-2 space-y-2">
            <BookNowButton size="w-full" />
          </div>
        )}
      </Card>
    </Link>
  );
};

export default AestheticianCard;
