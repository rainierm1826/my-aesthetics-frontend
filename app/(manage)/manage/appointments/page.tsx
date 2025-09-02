import { Suspense } from "react";
import DashboardCard from "@/components/cards/DashboardCard";
import { DataTable } from "@/components/DataTable";
import DatePagination from "@/components/DatePagination";
import DropDownAppointmentStatus from "@/components/DropDownAppointmentStatus";
import DropDownBranch from "@/components/DropDownBranch";
import OwnerWrapper from "@/components/OwnerWrapper";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { appointmentColumn } from "@/components/columns/appointment-column";
import {
  Appointment,
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/types";

async function getData(): Promise<Appointment[]> {
  return [
    {
      appointmentId: "A001",
      slotNumber: 1,
      userName: "Alice Johnson",
      branchName: "Manila",
      serviceName: "Facial Treatment",
      aestheticianName: "Maria Santos",
      paymentMethod: PaymentMethod.Cash,
      toPay: "1500",
      paymentStatus: PaymentStatus.Completed,
      voucherCode: "VOUCHER10",
      appointmentStatus: AppointmentStatus.Completed,
    },
    {
      appointmentId: "A002",
      slotNumber: 2,
      userName: "John Smith",
      branchName: "Cebu",
      serviceName: "Hair Removal",
      aestheticianName: "Anna Cruz",
      paymentMethod: PaymentMethod.Xendit,
      toPay: "2500",
      paymentStatus: PaymentStatus.Pending,
      voucherCode: "VOUCHER15",
      appointmentStatus: AppointmentStatus.Pending,
    },
    {
      appointmentId: "A003",
      slotNumber: 3,
      userName: "Mia Reyes",
      branchName: "Davao",
      serviceName: "Skin Whitening",
      aestheticianName: "Karen Lim",
      paymentMethod: PaymentMethod.Cash,
      toPay: "2000",
      paymentStatus: PaymentStatus.Partial,
      voucherCode: "VOUCHER20",
      appointmentStatus: AppointmentStatus.Waiting,
    },
    {
      appointmentId: "A004",
      slotNumber: 4,
      userName: "Carlos Lopez",
      branchName: "Manila",
      serviceName: "Acne Treatment",
      aestheticianName: "Liza Dela Cruz",
      paymentMethod: PaymentMethod.Xendit,
      toPay: "1800",
      paymentStatus: PaymentStatus.Completed,
      voucherCode: "VOUCHER5",
      appointmentStatus: AppointmentStatus.Completed,
    },
    {
      appointmentId: "A005",
      slotNumber: 5,
      userName: "Sophia Tan",
      branchName: "Cebu",
      serviceName: "Body Scrub",
      aestheticianName: "Grace Bautista",
      paymentMethod: PaymentMethod.Cash,
      toPay: "1200",
      paymentStatus: PaymentStatus.Pending,
      voucherCode: "",
      appointmentStatus: AppointmentStatus.Pending,
    },
    {
      appointmentId: "A006",
      slotNumber: 6,
      userName: "David Kim",
      branchName: "Davao",
      serviceName: "Facial Massage",
      aestheticianName: "Nina Ramos",
      paymentMethod: PaymentMethod.Xendit,
      toPay: "1600",
      paymentStatus: PaymentStatus.Partial,
      voucherCode: "VOUCHER25",
      appointmentStatus: AppointmentStatus.Waiting,
    },
    {
      appointmentId: "A007",
      slotNumber: 7,
      userName: "Emily Garcia",
      branchName: "Manila",
      serviceName: "Hair Treatment",
      aestheticianName: "Patricia Chua",
      paymentMethod: PaymentMethod.Cash,
      toPay: "1400",
      paymentStatus: PaymentStatus.Completed,
      voucherCode: "",
      appointmentStatus: AppointmentStatus.Completed,
    },
    {
      appointmentId: "A008",
      slotNumber: 8,
      userName: "Mark Anderson",
      branchName: "Cebu",
      serviceName: "Waxing",
      aestheticianName: "Olivia Flores",
      paymentMethod: PaymentMethod.Xendit,
      toPay: "1300",
      paymentStatus: PaymentStatus.Pending,
      voucherCode: "VOUCHER30",
      appointmentStatus: AppointmentStatus.Cancelled,
    },
    {
      appointmentId: "A009",
      slotNumber: 9,
      userName: "Rachel Lee",
      branchName: "Davao",
      serviceName: "Nail Spa",
      aestheticianName: "Sharon Castillo",
      paymentMethod: PaymentMethod.Cash,
      toPay: "1000",
      paymentStatus: PaymentStatus.Completed,
      voucherCode: "",
      appointmentStatus: AppointmentStatus.Completed,
    },
    {
      appointmentId: "A010",
      slotNumber: 10,
      userName: "James White",
      branchName: "Manila",
      serviceName: "Microdermabrasion",
      aestheticianName: "Cathy Villanueva",
      paymentMethod: PaymentMethod.Xendit,
      toPay: "3000",
      paymentStatus: PaymentStatus.Partial,
      voucherCode: "VOUCHER50",
      appointmentStatus: AppointmentStatus.Waiting,
    },
  ];
}

export default async function AppointmentsPage() {
  const data = await getData();

  return (
    <OwnerWrapper title="Manage Appointments">
      <div>
        <div className="mb-5 flex">
          <Suspense fallback={<div>Loading...</div>}>
            <DatePagination />
          </Suspense>
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <Suspense fallback={<div>Loading table...</div>}>
          <DataTable columns={appointmentColumn} data={data}>
            <div className="flex justify-between">
              <div className="flex gap-3 w-full">
                <Suspense fallback={<div>Loading search...</div>}>
                  <SearchInput
                    placeholder="Search by appointment id..."
                    size="w-1/2"
                  />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                  <DropDownBranch />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                  <DropDownAppointmentStatus />
                </Suspense>
              </div>
              <Button className="rounded-sm">Add Appointment</Button>
            </div>
          </DataTable>
        </Suspense>
      </div>
    </OwnerWrapper>
  );
}
