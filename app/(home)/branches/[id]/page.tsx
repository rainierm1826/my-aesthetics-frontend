// app/(home)/branch/[id]/page.tsx
import { getBranch } from "@/api/branch";
import { Card, CardContent } from "@/components/ui/card";
import { BranchResponse } from "@/lib/types/branch-types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RatingStar } from "@/components/RatingStar";
import { appointments } from "@/lib/data";
import BookNowButton from "@/components/buttons/BookNowButton";

interface BranchPageProps {
  params: { id: string };
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { id } = params;

  let branch: BranchResponse | null = null;

  try {
    branch = await getBranch(id);
  } catch (error) {
    console.error(error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "close":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!branch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <MapPin className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Branch not found
            </p>
            <p className="text-sm text-gray-500">
              The requested branch could not be located.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { branch: branchData } = branch;

  // Filter appointments for this branch

  const totalAppointments = appointments.length;

  const recentReviews = appointments
    .filter((app) => app.branch_comment && app.branch_rating)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="flex justify-center items-center">
          <div className="w-full rounded-lg overflow-hidden relative ">
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(
                    branchData.status
                  )}`}
                />
                <Badge
                  className={`capitalize ${
                    branchData.status == "active"
                      ? "bg-green-50 text-green-500"
                      : "bg-red-50 text-red-500"
                  } rounded-full`}
                >
                  {branchData.status === "active" ? "Open" : "Closed"}
                </Badge>
              </div>
            </div>
            <Avatar className="w-full h-48 rounded-lg">
              <AvatarImage
                src={branchData.image}
                alt={branchData.branch_name}
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback className="w-full h-full text-6xl rounded-lg">
                {branchData.branch_name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {branchData.branch_name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStar rating={branchData.avarage_rate} />
            <span className="text-sm text-gray-600">
              ({totalAppointments} Reviews)
            </span>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Location</h3>
            <div className="space-y-1 text-gray-700">
              <div>{branchData.address.lot}</div>
              <div>
                {branchData.address.barangay}, {branchData.address.city}
              </div>
              <div>
                {branchData.address.province}, {branchData.address.region}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                {branchData.address.city}, {branchData.address.province}
              </span>
            </div>
            {branchData.created_at && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Established{" "}
                  {formatDistanceToNow(new Date(branchData.created_at))} ago
                </span>
              </div>
            )}
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
                      <RatingStar rating={appointment.branch_rating || 0} />
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {appointment.service.service_name} with{" "}
                      {appointment.aesthetician.first_name}{" "}
                      {appointment.aesthetician.last_name} •{" "}
                      {formatDistanceToNow(new Date(appointment.created_at))}{" "}
                      ago
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {appointment.branch_comment}
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
              This branch hasn&apos;t received any reviews yet. Be the first to
              book and leave a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
