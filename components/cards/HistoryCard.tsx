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
import { patchAppointment } from "@/api/appointment";
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
      branch_comment: appointment.branch_comment || "",
      services: ((appointment.services || [])
        .filter((s) => String((s as { status?: string }).status || "").toLowerCase() === "completed")
        .sort((a, b) => {
          const ta = (a as { start_time?: string }).start_time ? new Date((a as { start_time?: string }).start_time as string).getTime() : 0;
          const tb = (b as { start_time?: string }).start_time ? new Date((b as { start_time?: string }).start_time as string).getTime() : 0;
          return tb - ta; // desc
        })
        .map((s) => ({
          service_id: (s as { service_id: string }).service_id,
          service_rating: (s as { service_rating?: number }).service_rating || 0,
          service_comment: (s as { service_comment?: string }).service_comment || "",
          aesthetician_rating: (s as { aesthetician_rating?: number }).aesthetician_rating || 0,
          aesthetician_comment: (s as { aesthetician_comment?: string }).aesthetician_comment || "",
        }))
      ),
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

  // Per-service cancel mutation (aligns with ReceiptCard service-level updates)
  const cancelServiceMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
    queryKey: [
      "appointment",
      "history",
    ] as string[],
    successMessages: {
      update: "Service cancelled successfully",
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

  const hasBranchRating = Boolean(appointment.branch_rating);
  const hasPerServiceRatings = ((appointment.services || [])
    .filter((s) => String((s as { status?: string }).status || "").toLowerCase() === "completed")
    .every((s) => Boolean((s as { service_rating?: number }).service_rating) && Boolean((s as { aesthetician_rating?: number }).aesthetician_rating))
  );
  const hasRatings = hasBranchRating && hasPerServiceRatings;

  // Define a stricter type for services used in history display
  type HistoryService = {
    id?: string;
    service_id: string;
    service_name_snapshot?: string;
    category_snapshot?: string;
    price_snapshot?: number;
    discounted_price_snapshot?: number;
    is_sale_snapshot?: boolean;
    is_pro_snapshot?: boolean;
    aesthetician_id?: string | null;
    aesthetician_name_snapshot?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    status?: string;
    service_rating?: number | null;
    service_comment?: string | null;
    aesthetician_rating?: number | null;
    aesthetician_comment?: string | null;
  };

  // Derive display from first service; aggregate totals across all services
  const services: HistoryService[] = (appointment.services as HistoryService[]) || [];
  const servicesSortedDesc: HistoryService[] = services
    .slice()
    .sort((a: HistoryService, b: HistoryService) => {
      const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
      const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
      return tb - ta; // Descending by date/time
    });
  const eligibleServicesSortedDesc: HistoryService[] = services
    .filter((s) => (s.status || '').toLowerCase() === 'completed')
    .slice()
    .sort((a: HistoryService, b: HistoryService) => {
      const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
      const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
      return tb - ta;
    });
  // Pick earliest start_time among services, fallback to first, then to appointment-level
  const firstService = services.length
    ? services
        .slice()
        .sort((a: HistoryService, b: HistoryService) => {
          const ta = a.start_time ? new Date(a.start_time).getTime() : Number.POSITIVE_INFINITY;
          const tb = b.start_time ? new Date(b.start_time).getTime() : Number.POSITIVE_INFINITY;
          return ta - tb;
        })[0]
    : null;

  // Aggregate pricing across all services
  const servicePriceTotal = services.reduce((sum: number, s: HistoryService) => {
    const cost = s.discounted_price_snapshot ?? s.price_snapshot ?? 0;
    return sum + Number(cost || 0);
  }, 0);
  const professionalFeeTotal = services.reduce((sum: number, s: HistoryService) => {
    const proFee = s.is_pro_snapshot ? 1500 : 0;
    return sum + Number(proFee || 0);
  }, 0);
  const subtotal = servicePriceTotal + professionalFeeTotal;

  let voucherDiscount = 0;
  if (appointment.voucher_discount_type_snapshot === "fixed") {
    voucherDiscount = Number(appointment.voucher_discount_amount_snapshot || appointment.discount_snapshot || 0);
  } else if (appointment.voucher_discount_type_snapshot === "percentage") {
    const pct = Number(appointment.voucher_discount_amount_snapshot || appointment.discount_snapshot || 0);
    voucherDiscount = (pct / 100) * subtotal;
  }



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
              {firstService?.start_time
                ? new Date(firstService.start_time).toLocaleDateString()
                : appointment.start_time
                  ? new Date(appointment.start_time).toLocaleDateString()
                  : "N/A"}
            </CardDescription>
          </div>
          {(() => {
            const s = appointment.status
              ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
              : "";
            const cls =
              s == "Completed"
                ? "bg-green-100 text-green-700"
                : s == "Waiting"
                  ? "bg-blue-100 text-blue-700"
                  : s == "On-process"
                    ? "bg-yellow-100 text-yellow-700"
                    : s == "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : s == "Pending"
                        ? "bg-gray-100 text-gray-700"
                        : "";
            return (
              <Badge className={`rounded-full ${cls}`}>
                {s == "Waiting" ? "Confirmed" : s}
              </Badge>
            );
          })()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
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
              <p className="text-gray-600">Earliest Time</p>
            </div>
            <p className="font-medium">
              {firstService?.start_time
                ? formatTo12HourTime(firstService.start_time)
                : appointment.start_time
                  ? formatTo12HourTime(appointment.start_time)
                  : "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {firstService?.start_time
                ? new Date(firstService.start_time).toLocaleDateString()
                : appointment.start_time
                  ? new Date(appointment.start_time).toLocaleDateString()
                  : ""}
            </p>
          </div>
        </div>

        <Separator />

        {/* Services List */}
        {services.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Services</p>
            <div className="space-y-2">
              {servicesSortedDesc.map((s: HistoryService, idx: number) => (
                <div key={s.id || idx} className="flex items-center justify-between text-sm border rounded-md p-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{s.service_name_snapshot || '-'}</span>
                    <span className="text-xs text-gray-500">{s.category_snapshot || '-'}</span>
                    <span className="text-xs text-gray-600">
                      Aesthetician: {s.aesthetician_name_snapshot || (
                        <span className="text-red-500 italic">Not assigned</span>
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    {/* Price per service */}
                    <div>
                      <p className="font-medium">{formatCurrency((s.discounted_price_snapshot ?? s.price_snapshot ?? 0) as number)}</p>
                      {s.is_sale_snapshot && (
                        <p className="text-xs text-gray-400 line-through">{formatCurrency((s.price_snapshot ?? 0) as number)}</p>
                      )}
                      {s.is_pro_snapshot && (
                        <p className="text-xs text-gray-600">Pro fee: {formatCurrency(1500)}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {s.start_time
                        ? `${new Date(s.start_time).toLocaleDateString()} • ${formatTo12HourTime(s.start_time)}`
                        : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {s.is_pro_snapshot && (
                        <Badge className="text-xxs bg-green-500 text-white rounded-full">Professional</Badge>
                      )}
                      {s.status && (() => {
                        const ss = String(s.status);
                        const S = ss.charAt(0).toUpperCase() + ss.slice(1);
                        const scl =
                          S == "Completed"
                            ? "bg-green-100 text-green-700"
                            : S == "Waiting"
                              ? "bg-blue-100 text-blue-700"
                              : S == "On-process"
                                ? "bg-yellow-100 text-yellow-700"
                                : S == "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : S == "Pending"
                                    ? "bg-gray-100 text-gray-700"
                                    : "";
                        return (
                          <Badge className={`text-xxs rounded-full ${scl}`}>
                            {S == "Waiting" ? "Confirmed" : S}
                          </Badge>
                        );
                      })()}
                      {(s.status || 'pending') !== 'completed' && (s.status || 'pending') !== 'cancelled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          disabled={cancelServiceMutation.isPending}
                          onClick={() =>
                            cancelServiceMutation.mutate({
                              data: {
                                appointment_id: appointment.appointment_id,
                                service_id: s.service_id,
                                status: 'cancelled',
                              },
                              token: access_token || '',
                            })
                          }
                        >
                          Cancel Service
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Breakdown (aggregated across all services) */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Service Price</p>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(servicePriceTotal)}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">Professional Fee</p>
            <p className="font-medium">{formatCurrency(professionalFeeTotal)}</p>
          </div>

          {Boolean((appointment.voucher_discount_amount_snapshot || appointment.discount_snapshot) && voucherDiscount > 0) && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Voucher Discount{appointment.voucher_code_snapshot ? ` (${appointment.voucher_code_snapshot})` : ''}</p>
              <p className="font-medium text-red-500">- {formatCurrency(voucherDiscount)}</p>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <p className="font-semibold">Total Amount</p>
            <p className="text-lg font-bold">{formatCurrency(appointment.to_pay)}</p>
          </div>

          {appointment.final_payment_method && (
            <div className="flex justify-between items-center pt-1">
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{appointment.final_payment_method}</p>
            </div>
          )}

          
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
              {/* Per-service summary */}
              {eligibleServicesSortedDesc.map((s: HistoryService, idx) => (
                <div key={s.id || `${idx}`} className="border rounded p-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{s.service_name_snapshot || 'Service'}</span>
                    <span>{s.aesthetician_name_snapshot || 'Aesthetician'}</span>
                  </div>
                  <div className="mt-1 flex gap-6">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">Service:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (s.service_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">Aesthetician:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (s.aesthetician_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm pt-2 border-t">
              {appointment.branch_comment && (
                <div>
                  <p className="font-medium text-gray-700">Branch Comment:</p>
                  <p className="text-gray-600">{appointment.branch_comment}</p>
                </div>
              )}
              {eligibleServicesSortedDesc.map((s: HistoryService, idx) => (
                <div key={s.id || `c-${idx}`} className="text-xs text-gray-700">
                  {s.service_comment && (
                    <div>
                      <p className="font-medium">Service Comment:</p>
                      <p className="text-gray-600">{s.service_comment}</p>
                    </div>
                  )}
                  {s.aesthetician_comment && (
                    <div>
                      <p className="font-medium">Aesthetician Comment:</p>
                      <p className="text-gray-600">{s.aesthetician_comment}</p>
                    </div>
                  )}
                </div>
              ))}
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

              {/* Per-service reviews (completed services only) */}
              {eligibleServicesSortedDesc.map((s: HistoryService, idx) => (
                <div key={s.id || `f-${idx}`} className="space-y-3 rounded-md border p-3">
                  <div className="text-sm font-medium">
                    {s.service_name_snapshot} {" "}
                    <span className="text-xs text-gray-500">{s.aesthetician_name_snapshot || "No Aesthetician"}</span>
                  </div>

                  <FormField
                    control={control}
                    name={`services.${idx}.service_rating` as const}
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
                    name={`services.${idx}.service_comment` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Comment</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your thoughts about the service" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`services.${idx}.aesthetician_rating` as const}
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
                    name={`services.${idx}.aesthetician_comment` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aesthetician Comment</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your thoughts about the aesthetician" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

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
