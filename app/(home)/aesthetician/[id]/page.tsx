// app/(home)/aesthetician/[id]/page.tsx
import { getAesthetician } from "@/api/aesthetician";
import { AestheticianResponse } from "@/lib/types/aesthetician-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Phone, MapPin, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RatingStar } from "@/components/RatingStar";
import { appointments } from "@/lib/data";
import BookNowButton from "@/components/buttons/BookNowButton";

interface PageProps {
  params: { id: string };
}

export default async function AestheticianPage({ params }: PageProps) {
  const { id } = params;

  let aesthetician: AestheticianResponse | null = null;

  try {
    aesthetician = await getAesthetician(id);
  } catch (error) {
    console.error(error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "working":
        return "bg-yellow-300";
      case "off-duty":
        return "bg-red-500";
      case "on-break":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!aesthetician) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <User className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Aesthetician not found
            </p>
            <p className="text-sm text-gray-500">
              The requested aesthetician could not be located.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { aesthetician: aestheticianData } = aesthetician;

  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  ).length;

  const recentReviews = appointments
    .filter((app) => app.aesthetician_comment && app.aesthetician_rating)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
            <Avatar className="w-full h-full rounded-lg">
              <AvatarImage
                src={aestheticianData.image}
                alt={`${aestheticianData.first_name} ${aestheticianData.last_name}`}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="w-full h-full text-6xl rounded-lg">
                {aestheticianData.first_name[0]}
                {aestheticianData.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {aestheticianData.first_name}{" "}
              {aestheticianData.middle_initial &&
                `${aestheticianData.middle_initial}.`}{" "}
              {aestheticianData.last_name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(
                    aestheticianData.availability
                  )}`}
                />
                <Badge variant="outline" className="capitalize rounded-full">
                  {aestheticianData.availability.replace("-", " ")}
                </Badge>
              </div>
              <Badge
                className={`capitalize ${
                  aestheticianData.experience == "pro"
                    ? "bg-green-50 text-green-500"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {aestheticianData.experience === "pro"
                  ? "Professional"
                  : "Regular"}
              </Badge>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStar rating={aestheticianData.average_rate} />
            <span className="text-sm text-gray-600">
              ({completedAppointments} Appointments)
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                {aestheticianData.phone_number}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                {aestheticianData.branch.branch_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 capitalize">
                {aestheticianData.sex}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                Joined{" "}
                {formatDistanceToNow(new Date(aestheticianData.created_at))} ago
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

        {recentReviews.length > 0 ? (
          <div className="space-y-6">
            {recentReviews.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback>
                      {appointment.user
                        ? `${appointment.user.first_name[0]}${appointment.user.last_name[0]}`
                        : appointment.walk_in
                        ? `${appointment.walk_in.first_name[0]}${appointment.walk_in.last_name[0]}`
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-medium text-gray-900">
                        {appointment.user
                          ? `${appointment.user.first_name} ${appointment.user.last_name}`
                          : appointment.walk_in
                          ? `${appointment.walk_in.first_name} ${appointment.walk_in.last_name}`
                          : "Anonymous"}
                      </div>
                      <RatingStar
                        rating={appointment.aesthetician_rating || 0}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {appointment.service.service_name} •{" "}
                      {formatDistanceToNow(new Date(appointment.created_at))}{" "}
                      ago
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {appointment.aesthetician_comment}
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
              This aesthetician hasn&apos;t received any reviews yet. Be the
              first to book and leave a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
