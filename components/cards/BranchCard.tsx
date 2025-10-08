import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { RatingStar } from "../RatingStar";
import { Clock, MapPin } from "lucide-react";
import BookNowButton from "../buttons/BookNowButton";
import clsx from "clsx";
import { BranchCardProps } from "@/lib/types/branch-types";
import Link from "next/link";

const BranchCard = ({
  className,
  action,
  branchName,
  status,
  image,
  barangay,
  province,
  city,
  lot,
  rating,
  branch_id,
}: BranchCardProps) => {
  return (
    <Link href={`/branches/${branch_id}`} passHref>
      <Card
        className={clsx(
          "pt-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col w-[200px]",
          className
        )}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative w-full aspect-[16/9] flex-shrink-0 overflow-hidden">
            <Image
              alt={branchName}
              src={image ?? "/fallbackImage.jpg"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Status Badge */}
            <div
              className={`absolute top-1.5 left-1.5 flex items-center gap-1 ${
                status == "active" ? "bg-green-500" : "bg-red-500"
              } text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full`}
            >
              {status == "active" ? "Open" : "Closed"}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-2 space-y-1.5 flex-grow flex flex-col">
            {/* Branch Name & Rating */}
            <div className="space-y-0.5">
              <h3 className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">
                MY Aesthetics Brow Studio
              </h3>
              <p className="text-[9px] font-medium text-primary line-clamp-1">
                {branchName}
              </p>

              <div className="flex items-center gap-0.5 flex-1 min-w-0">
                <RatingStar rating={rating} />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1">
              <MapPin className="w-2.5 h-2.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-[9px] text-gray-600 leading-tight line-clamp-2">
                {`${lot}, ${barangay}, ${city}, ${province}`}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-[9px] text-gray-600">
                Open until 5:00 PM
              </span>
            </div>

            {/* Features/Amenities */}
            <div className="flex flex-wrap gap-0.5">
              <span className="text-[8px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full">
                Parking
              </span>
              <span className="text-[8px] bg-green-50 text-green-600 px-1 py-0.5 rounded-full">
                WiFi
              </span>
              <span className="text-[8px] bg-purple-50 text-purple-600 px-1 py-0.5 rounded-full">
                AC
              </span>
            </div>

            {/* Action Section */}
            {action && (
              <div className="pt-1">
                <BookNowButton size="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BranchCard;
