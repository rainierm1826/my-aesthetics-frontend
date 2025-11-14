"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/provider/store/authStore";
import {
  getCustomerDetail,
  getCustomerSpendingByService,
  getCustomerTimeline,
  type CustomerDetailResponse,
  type SpendingResponse,
  type TimelineResponse,
} from "@/api/customer-analytics";
import { formatNumber } from "@/lib/function";

interface CustomerAnalyticsModalProps {
  customerId: string;
  customerType: "online" | "walkin";
  customerName: string;
}

const CustomerAnalyticsModal: React.FC<CustomerAnalyticsModalProps> = ({
  customerId,
  customerType,
}) => {
  const { access_token } = useAuthStore();

  const { data: customerDetail, isLoading: detailLoading } = useQuery<CustomerDetailResponse>({
    queryKey: ["customer-detail", customerId, customerType],
    queryFn: async () => {
      if (!access_token) throw new Error("Authentication token not found");
      const data = await getCustomerDetail(customerId, customerType, access_token);
      console.log("API Response:", data); // Debug log
      return data;
    },
    enabled: !!access_token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  const { data: spendingData, isLoading: spendingLoading } = useQuery<SpendingResponse>({
    queryKey: ["customer-spending", customerId, customerType],
    queryFn: async () => {
      if (!access_token) throw new Error("Authentication token not found");
      return getCustomerSpendingByService(customerId, customerType, access_token);
    },
    enabled: !!access_token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: timelineData, isLoading: timelineLoading } = useQuery<TimelineResponse>({
    queryKey: ["customer-timeline", customerId, customerType],
    queryFn: async () => {
      if (!access_token) throw new Error("Authentication token not found");
      return getCustomerTimeline(customerId, customerType, access_token);
    },
    enabled: !!access_token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid and not 1900
      if (isNaN(date.getTime()) || date.getFullYear() === 1900) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (detailLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading customer details...</p>
      </div>
    );
  }
  
  const customer = customerDetail?.customer;
  const stats = customerDetail?.stats;
  const preferences = customerDetail?.preferences;
  
  if (!customer || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-red-500 font-semibold">Error: No customer data received</p>
        <p className="text-xs text-gray-500">Status: {customerDetail?.status}</p>
        <p className="text-xs text-gray-500 max-w-md break-words">
          {JSON.stringify(customerDetail || "No data")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-[80vh] overflow-y-auto space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                  <Badge  className={`rounded-full ${ customerType === "online" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}> 
                    {customerType === "online" ? "Online" : "Walk-in"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium mt-1">{customer?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
                  <p className="text-sm font-medium mt-1">
                    {formatDate(customer?.joined_date || "")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-2">Appointments</p>
                  <p className="text-3xl font-bold">{stats?.total_appointments || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-2">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.completed_appointments || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-2">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats?.cancelled_appointments || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-2">Total Spent</p>
                  <p className="text-3xl font-bold break-words">₱{formatNumber(stats?.total_spent || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Average Transaction</p>
                <p className="text-lg font-bold">{formatCurrency(stats?.average_transaction || 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Days Since Last Appointment</p>
                <p className="text-lg font-bold">{stats?.days_since_last_appointment == 0 ? "Just now" : stats?.days_since_last_appointment ?? "N/A"} {stats.days_since_last_appointment == 0 ? "" : "days"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Favorite Services</CardTitle>
                <CardDescription>Most booked services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(preferences?.favorite_services || []).map((service, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span>{service.service}</span>
                      <Badge variant="outline">{service.count}x</Badge>
                    </li>
                  ))}
                  {(!preferences?.favorite_services || preferences.favorite_services.length === 0) && (
                    <p className="text-xs text-gray-400">No data</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Favorite Aestheticians</CardTitle>
                <CardDescription>Most frequent aesthetician</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(preferences?.favorite_aestheticians || []).map((aes, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span>{aes.aesthetician}</span>
                      <Badge variant="outline">{aes.count}x</Badge>
                    </li>
                  ))}
                  {(!preferences?.favorite_aestheticians || preferences.favorite_aestheticians.length === 0) && (
                    <p className="text-xs text-gray-400">No data</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Favorite Branches</CardTitle>
                <CardDescription>Most visited branch</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(preferences?.favorite_branches || []).map((branch, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span>{branch.branch}</span>
                      <Badge variant="outline">{branch.count}x</Badge>
                    </li>
                  ))}
                  {(!preferences?.favorite_branches || preferences.favorite_branches.length === 0) && (
                    <p className="text-xs text-gray-400">No data</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spending Tab */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown by Service</CardTitle>
              <CardDescription>Total spent and frequency by service</CardDescription>
            </CardHeader>
            <CardContent>
              {spendingLoading ? (
                <p className="text-gray-500">Loading spending data...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Service</th>
                        <th className="text-right py-2">Appointments</th>
                        <th className="text-right py-2">Total Spent</th>
                        <th className="text-right py-2">Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(spendingData?.spending || []).map((item, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2">{item.service}</td>
                          <td className="text-right">{item.appointment_count}</td>
                          <td className="text-right font-semibold">
                            {formatCurrency(item.total_spent)}
                          </td>
                          <td className="text-right">
                            {formatCurrency(item.average_spent)}
                          </td>
                        </tr>
                      ))}
                      {(!spendingData?.spending || spendingData.spending.length === 0) && (
                        <tr>
                          <td colSpan={4} className="py-2 text-center text-gray-400">
                            No spending data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>All past and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <p className="text-gray-500">Loading timeline...</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {(timelineData?.appointments || []).map((apt, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{apt.service_name_snapshot}</p>
                          <Badge
                            className={`rounded-full capitalize ${
            apt.status == "completed"
              ? "bg-green-100 text-green-700"
              : apt.status == "waiting"
                ? "bg-blue-100 text-blue-700"
                : apt.status == "on-process"
                  ? "bg-yellow-100 text-yellow-700"
                  : apt.status == "cancelled"
                    ? "bg-red-100 text-red-700"
                    : apt.status == "pending "
                      ? "bg-gray-100 text-gray-700"
                      : ""
          }`}
                          >
                            {apt.status == "waiting" ? "Confirm" : apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          With {apt.aesthetician_name_snapshot} at {apt.branch_name_snapshot}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(apt.start_time)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatCurrency(apt.to_pay)}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {apt.payment_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(timelineData?.appointments || []).length === 0 && (
                    <p className="text-center text-gray-400 py-4">No appointments found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAnalyticsModal;
