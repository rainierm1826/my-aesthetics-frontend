import { AppointmentListResponse } from "@/lib/types/appointment-types";
import AppointmentsTab from "@/components/tabs/AppointmentsTab";
import CustomerWrapper from "@/components/wrapper/CustomerWrapper";
import { getHistory } from "@/api/appointment";
import { cookies } from "next/headers";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || "";
  const data: AppointmentListResponse = await getHistory({ token });
  const appointment = data.appointment;

  const activeAppointments = appointment.filter((a) =>
    ["pending", "waiting", "on-process"].includes(a.status)
  );
  const completedAppointments = appointment.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments = appointment.filter(
    (a) => a.status === "cancelled"
  );

  return (
    <CustomerWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <p className="text-gray-600 mt-1">Manage and track your appointments</p>
      </div>

      <AppointmentsTab
        activeAppointments={activeAppointments}
        completedAppointments={completedAppointments}
        cancelledAppointments={cancelledAppointments}
      />
    </CustomerWrapper>
  );
}
