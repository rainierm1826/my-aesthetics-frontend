import AppointmentDashboard from "@/components/dashboard/AppointmentDashboard";
import OwnerWrapper from "@/components/ManagementWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function AppointmentsDashboardPage() {
  return (
    <OwnerWrapper title="Appointments Dashboard">
      <Suspense fallback={<Skeleton />}>
        <AppointmentDashboard />
      </Suspense>
    </OwnerWrapper>
  );
}
