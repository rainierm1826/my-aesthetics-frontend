import { getService } from "@/api/service";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceResponse } from "@/lib/types/service-types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Tag, Tags } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RatingStar } from "@/components/RatingStar";
import BookNowButton from "@/components/buttons/BookNowButton";
import { Review } from "@/lib/types/appointment-types";
import { getReviews } from "@/api/review";

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;

  let service: ServiceResponse | null = null;
  let reviews: Review[] = [];

  try {
    service = await getService(id);
  } catch (error) {
    console.error(error);
  }

  try {
    const res = await getReviews({ service_id: id });
    if (res.status) {
      reviews = res.review;
    }
  } catch (error) {
    console.error(error);
  }

  console.log("length", reviews.length);
  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Tag className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Service not found
            </p>
            <p className="text-sm text-gray-500">
              The requested service could not be located.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { service: serviceData } = service;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden relative">
            {serviceData.is_sale && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="destructive" className="text-white">
                  {serviceData.discount_type == "percentage"
                    ? `${serviceData.discount}% Discount`
                    : `₱${serviceData.discount} Off`}
                </Badge>
              </div>
            )}
            <Avatar className="w-full h-full rounded-lg">
              <AvatarImage
                src={serviceData.image}
                alt={serviceData.service_name}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="w-full h-full text-6xl rounded-lg">
                {serviceData.service_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Category */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {serviceData.service_name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="capitalize">
                {serviceData.category}
              </Badge>
              {serviceData.is_sale && (
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-200"
                >
                  On Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStar rating={serviceData.avarage_rate} />
            <span className="text-sm text-gray-600">
              ({reviews.length} Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {serviceData.is_sale ? (
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-primary">
                  ₱{serviceData.discounted_price}
                </div>
                <div className="text-xl text-gray-500 line-through">
                  ₱{serviceData.price}
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                ₱{serviceData.price}
              </div>
            )}
            <div className="text-sm text-gray-500">Per Session</div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {serviceData.description}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                {serviceData.branch.branch_name || "Available at all branches"}
              </span>
            </div>
            {serviceData.is_sale && (
              <div className="flex items-center gap-3">
                <Tags className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 rounded-full">
                  {serviceData.discount_type === "percentage"
                    ? `${serviceData.discount}% Discount`
                    : `₱${serviceData.discount} Off`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                Available since{" "}
                {formatDistanceToNow(new Date(serviceData.created_at))} ago
              </span>
            </div>
          </div>

          <div className="mt-10">
            <BookNowButton size="w-full" />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback>{review.customer_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-medium text-gray-900 capitalize">
                        {review.customer_name}
                      </div>
                      <RatingStar rating={review.service_rating || 0} />
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.service_comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-sm text-gray-500">
              This service hasn&apos;t received any reviews yet. Be the first to
              book and leave a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
