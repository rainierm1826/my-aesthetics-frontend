"use client";

import { DataTable } from "@/components/DataTable";
import { customerColumns } from "@/components/columns/customer-columns";
import { CustomerRow } from "@/components/columns/customer-columns";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useAllCustomers } from "@/hooks/useAllCustomers";
import { useState } from "react";
import WalkInCustomerForm from "../forms/WalkInCustomerForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardCard from "@/components/cards/DashboardCard";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useCustomerSummary } from "@/hooks/useCustomerSummary";
import { useAuthStore } from "@/provider/store/authStore";
import { formatNumber } from "@/lib/function";

export default function CustomerTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [type, setType] = useState<"online" | "walkin" | "">("");
  const { access_token, isAuthLoading, auth } = useAuthStore();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("query") || "";
  const limit = Number(searchParams.get("limit") ?? "10");

  const { data, isFetching, isError } = useAllCustomers({
    page,
    limit,
    search,
    type,
  });

  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useCustomerSummary({ token: access_token || "" });

  const customers: CustomerRow[] = data?.customers ?? [];
  const pagination = data?.pagination;

  const handleTypeChange = (value: string) => {
    setType(value === "all" ? "" : (value as "online" | "walkin"));
    // Reset to page 1 when changing type
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  };

  return (
    <>
      {/* Customer Summary Cards - Only visible for owner role */}
      {auth?.role === "owner" && (
        <div className="mb-8">
          {isFetchingSummaryData || isAuthLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonScoreBoard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Customers"
                content={formatNumber(summaryData?.total_customers || 0)}
                info="Total number of registered and walk-in customers"
              />
              <DashboardCard
                title="Active Customers"
                content={formatNumber(summaryData?.active_customers || 0)}
                info="Customers with appointments in the last 30 days"
              />
              <DashboardCard
                title="Retention Rate"
                content={`${summaryData?.customer_retention_rate || 0}%`}
                info="Percentage of customers with 2+ completed appointments"
              />
              <DashboardCard
                title="Average Lifetime Value"
                content={`₱${formatNumber(summaryData?.average_customer_lifetime_value || 0)}`}
                info="Average total revenue generated per customer"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="w-full sm:w-1/2">
            <SearchInput
              placeholder="Search by name or phone..."
              size="w-full"
            />
          </div>
          <div className="w-full sm:w-1/4">
            <Select value={type || "all"} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">Online Customers</SelectItem>
                <SelectItem value="walkin">Walk-in Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">
          <WalkInCustomerForm
            method="post"
            formTitle="Add Walk-in Customer"
            formDescription="Fill in the customer's name and phone number to register a walk-in customer."
            dialogButtonLabel="New Customer"
            buttonLabel="Create Customer"
          />
        </div>
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={customerColumns}
          data={customers}
          pageCount={pagination?.total_pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
