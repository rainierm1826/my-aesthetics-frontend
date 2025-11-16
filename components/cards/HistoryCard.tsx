import { Appointment } from "@/lib/types/appointment-types";
import { ratingFormSchema, RatingFormValues } from "@/schema/ratingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin, Star, User, Clock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import SelectRatingStar from "../SelectRatingStar";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { useAuthStore } from "@/provider/store/authStore";
import { patchAppointmentReview } from "@/api/review";
import { formatCurrency, formatTo12HourTime } from "@/lib/function";

export const HistoryCard = ({
  appointment,
  showRatingForm,
}: {
  appointment: Appointment;
  showRatingForm?: boolean;
}) => {
  const { access_token } = useAuthStore();

  const [showForm, setShowForm] = useState(false);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      branch_rating: appointment.branch_rating || 0,
      service_rating: appointment.service_rating || 0,
      aesthetician_rating: appointment.aesthetician_rating || 0,
      branch_comment: appointment.branch_comment || "",
      service_comment: appointment.service_comment || "",
      aesthetician_comment: appointment.aesthetician_comment || "",
    },
  });

  const { handleSubmit, control } = form;

  const updateReviews = useBaseMutation("patch", {
    updateFn: patchAppointmentReview,
    queryKey: ["history"],
    successMessages: {
      update: "Your review was submitted",
    },
  });

  const onSubmit = (values: RatingFormValues) => {
    updateReviews.mutate({
      data: { ...values, appointment_id: appointment.appointment_id },
      token: access_token || "",
    });
    console.log(values);
    setShowForm(false);
  };

  const hasRatings =
    appointment.branch_rating &&
    appointment.service_rating &&
    appointment.aesthetician_rating;

  // Calculate costs like in ReceiptCard
  const serviceCost =
    appointment.discounted_price_snapshot ?? appointment.price_snapshot;
  const professionalFee = appointment.is_pro_snapshot ? 1500 : 0;
  const subtotal = serviceCost + professionalFee;

  let voucherDiscount = 0;
  if (appointment.voucher_discount_type_snapshot === "fixed") {
    voucherDiscount = appointment.discount_snapshot ?? 0;
  } else if (appointment.voucher_discount_type_snapshot === "percentage") {
    voucherDiscount = ((appointment.discount_snapshot ?? 0) / 100) * subtotal;
  }

  const totalServiceCost = subtotal - voucherDiscount;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {appointment.customer_name_snapshot}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {new Date(appointment.start_time).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge
            className={`rounded-full ${
              appointment.status == "completed"
                ? "bg-green-100 text-green-700"
                : appointment.status == "waiting"
                  ? "bg-blue-100 text-blue-700"
                  : appointment.status == "on-process"
                    ? "bg-yellow-100 text-yellow-700"
                    : appointment.status == "cancelled"
                      ? "bg-red-100 text-red-700"
                      : appointment.status == "pending"
                        ? "bg-gray-100 text-gray-700"
                        : ""
            }`}
          >
            <p className="capitalize">{appointment.status == "waiting" ? "Confirm" : appointment.status}</p>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Service</p>
            <p className="font-medium">{appointment.service_name_snapshot}</p>
            <p className="text-xs text-gray-500">
              {appointment.category_snapshot}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Aesthetician</p>
            <p className="font-medium">
              {appointment.aesthetician_name_snapshot || (
                <span className="text-red-500 italic text-sm">Not assigned</span>
              )}
            </p>
            {appointment.is_pro_snapshot && (
              <Badge className="text-xs mt-1 bg-green-50 text-green-700 rounded-full">
                Professional
              </Badge>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              <p className="text-gray-600">Branch</p>
            </div>
            <p className="font-medium">{appointment.branch_name_snapshot}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-600" />
              <p className="text-gray-600">Time</p>
            </div>
            <p className="font-medium">{formatTo12HourTime(appointment.start_time)}</p>
          </div>
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Service Price</p>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(serviceCost)}</p>
              {appointment.is_sale_snapshot && (
                <p className="text-xs text-gray-400 line-through">
                  {formatCurrency(appointment.price_snapshot)}
                </p>
              )}
            </div>
          </div>

          {appointment.is_pro_snapshot && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Professional Fee</p>
              <p className="font-medium">{formatCurrency(professionalFee)}</p>
            </div>
          )}

          {appointment.discount_snapshot && appointment.discount_snapshot > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Discount
                {appointment.voucher_code_snapshot &&
                  ` (${appointment.voucher_code_snapshot})`}
              </p>
              <p className="font-medium text-red-500">
                -
                {appointment.voucher_discount_type_snapshot === "fixed"
                  ? formatCurrency(appointment.discount_snapshot)
                  : `${appointment.discount_snapshot}%`}
              </p>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <p className="font-semibold">Total Amount</p>
            <p className="text-lg font-bold">{formatCurrency(totalServiceCost)}</p>
          </div>

          {appointment.final_payment_method && (
            <div className="flex justify-between items-center pt-1">
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{appointment.final_payment_method}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-gray-600">Payment Status</p>
            <p className="font-semibold uppercase text-xs">{appointment.payment_status}</p>
          </div>
        </div>

        <Separator />

        {showRatingForm && !hasRatings && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full cursor-pointer"
          >
            Add Rating & Comments
          </Button>
        )}

        {showRatingForm && hasRatings && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Your Ratings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Branch:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (appointment.branch_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (appointment.service_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Aesthetician:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (appointment.aesthetician_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm pt-2 border-t">
              {appointment.branch_comment && (
                <div>
                  <p className="font-medium text-gray-700">Branch Comment:</p>
                  <p className="text-gray-600">{appointment.branch_comment}</p>
                </div>
              )}
              {appointment.service_comment && (
                <div>
                  <p className="font-medium text-gray-700">Service Comment:</p>
                  <p className="text-gray-600">{appointment.service_comment}</p>
                </div>
              )}
              {appointment.aesthetician_comment && (
                <div>
                  <p className="font-medium text-gray-700">
                    Aesthetician Comment:
                  </p>
                  <p className="text-gray-600">
                    {appointment.aesthetician_comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showForm && (
          <Form {...form}>
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Rate Your Experience</h4>

              <FormField
                control={control}
                name="branch_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Rating</FormLabel>
                    <FormControl>
                      <SelectRatingStar
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="branch_comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts about the branch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="service_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Rating</FormLabel>
                    <FormControl>
                      <SelectRatingStar
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="service_comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts about the service"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="aesthetician_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aesthetician Rating</FormLabel>
                    <FormControl>
                      <SelectRatingStar
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="aesthetician_comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aesthetician Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts about the aesthetician"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 cursor-pointer"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
