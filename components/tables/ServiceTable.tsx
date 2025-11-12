"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/lib/types/service-types";
import { serviceColumn } from "@/components/columns/service-column";
import ServiceForm from "../forms/ServiceForm";
import DropDownServiceCategory from "../selects/DropDownServiceCategory";
import DropDownBranch from "../selects/DropDownBranch";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useServiceSummary } from "@/hooks/useServiceAnalytics";
import { ServiceAnalyticsResponse } from "@/lib/types/analytics-type";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import DashboardCard from "../cards/DashboardCard";

export default function ServiceTable() {
  const { auth, isAuthLoading } = useAuthStore();
  const { user } = useUserStore();
  const { data, isFetching, isError } = useServices(user?.branch?.branch_id);
  const services: Service[] = data?.service ?? [];

  const { access_token } = useAuthStore();
  const { data: serviceSummary, isFetching: isFetchingServiceSummary } =
    useServiceSummary(access_token || "");

  const summary: ServiceAnalyticsResponse = serviceSummary || {
    average_service_rating: 0,
    sale_service: 0,
    total_services: 0,
  };

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  return (
    <>
      {auth?.role === "owner" ? (
        isFetchingServiceSummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonScoreBoard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <DashboardCard
              title="Total Services"
              content={summary.total_services}
              info="Total number of active services across branches"
            />
            <DashboardCard
              title="Average Rating"
              content={summary.average_service_rating}
              info="Overall average rating of all services across branches"
            />
            <DashboardCard
              title="On Sale Services"
              content={summary.sale_service}
              info="Total number of services currently on sale across branches"
            />
          </div>
        )
      ) : null}

      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="w-full sm:w-1/2">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
            {auth?.role == "owner" && (
              <div className="w-full sm:w-auto">
                <DropDownBranch useUrlParams={true} includeAllOption={true} />
              </div>
            )}
            <div className="w-full sm:w-auto">
              <DropDownServiceCategory
                useUrlParams={true}
                includeAllOption={true}
              />
            </div>
          </div>
          <div className="w-full sm:w-auto flex-shrink-0">
            <ServiceForm
              method="post"
              formTitle="Add New Service"
              formDescription="Fill in the details below to add a new service to help customers recognize it instantly."
              renderDialog={true}
              dialogButtonLabel="New Service"
              buttonLabel="Create Service"
            />
          </div>
        </div>
        {isFetching ? (
          <SkeletonTable />
        ) : isError ? (
          toast("Internal Error")
        ) : (
          <DataTable
            columns={serviceColumn}
            data={services}
            pageCount={data?.pages}
            windowsSize={5}
          />
        )}
      </div>
    </>
  );
}
