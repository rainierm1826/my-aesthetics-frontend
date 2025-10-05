"use client";

import { Clock } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "./ui/badge";
import DropDownBranch from "./selects/DropDownBranch";
import { useAppointments } from "@/hooks/useAppointments";
import { useUserStore } from "@/provider/store/userStore";
import { useAuthStore } from "@/provider/store/authStore";
import { Appointment } from "@/lib/types/appointment-types";
import { ordinal } from "@/lib/function";
import SkeletonWaitingList from "./skeletons/SkeletonWaitingList";

const WaitingList = () => {
  const { access_token } = useAuthStore();
  const { user } = useUserStore();
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(
    user?.branch?.branch_id
  );

  const { data, isFetching } = useAppointments({
    branchId: selectedBranchId,
    token: access_token || "",
  });
  const appointments: Appointment[] = data?.appointment ?? [];

  return (
    <div className="bg-white shadow-sm p-6 border-t md:border-l border-gray-200 md:min-h-screen md:[direction:rtl] overflow-auto">
      <div className="md:[direction:ltr]">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <span className="truncate">Waiting List</span>
          </h2>
          <DropDownBranch
            useUrlParams={false}
            value={selectedBranchId}
            onValueChange={setSelectedBranchId}
          />
        </div>

        <div className="space-y-3">
          {isFetching ? (
            <SkeletonWaitingList />
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium mb-1">
                No appointments yet
              </p>
              <p className="text-sm text-gray-400">
                Appointments will appear here when customers check in
              </p>
            </div>
          ) : (
            appointments.map((item) => (
              <div
                key={item.appointment_id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 min-w-fit">
                      {ordinal(item.slot_number)}
                    </span>
                    <p className="font-semibold text-gray-900">
                      {item.customer_name_snapshot}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "waiting"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "on-process"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1 ml-10">
                  {item.service_name_snapshot}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
