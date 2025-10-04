import AppointmentsTab from "@/components/tabs/AppointmentsTab";
import CustomerWrapper from "@/components/wrapper/CustomerWrapper";

export default async function HistoryPage() {
  return (
    <CustomerWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <p className="text-gray-600 mt-1">Manage and track your appointments</p>
      </div>

      <AppointmentsTab />
    </CustomerWrapper>
  );
}
