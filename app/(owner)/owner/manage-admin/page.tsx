import AdminForm from "@/components/AdminForm";
import DashboardCard from "@/components/DashboardCard";
import { DataTable } from "@/components/DataTable";
import DropDownBranch from "@/components/DropDownBranch";
import OwnerWrapper from "@/components/OwnerWrapper";
import SearchInput from "@/components/SearchInput";
import { adminColumn } from "@/lib/admin-column";
import { Admin } from "@/lib/types";

async function getData(): Promise<Admin[]> {
  return [
    {
      branchName: "Batangas City Branch",
      firstName: "Abby",
      lastName: "Mendoza",
      middleInitial: "A",
      email: "abby.mendoza@batangasbranch.com",
    },
    {
      branchName: "Lipa City Branch",
      firstName: "Joanna",
      lastName: "Ramos",
      middleInitial: "C",
      email: "joanna.ramos@lipabranch.com",
    },
    {
      branchName: "Sto Tomas Branch",
      firstName: "Kristine",
      lastName: "Dela Cruz",
      middleInitial: "O",
      email: "kristine.delacruz@stotomasbranch.com",
    },
    {
      branchName: "Lemery Branch",
      firstName: "Lyka",
      lastName: "Rizal",
      middleInitial: "M",
      email: "lyka.rizal@lemerybranch.com",
    },
  ];
}
export default async function AdminPage() {
  const data = await getData();
  return (
    <OwnerWrapper title="Manage Admins">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <DataTable columns={adminColumn} data={data}>
          <div className="flex justify-between">
            <div className="flex gap-3 w-full">
              <SearchInput placeholder="Search by admin name..." size="w-1/2" />
              <DropDownBranch />
            </div>
            <AdminForm
              formTitle="Add Admin"
              formDescription="Add a new admin by filling in the details below."
              buttonLabel="Create Admin"
              dialogButtonLabel="New Admin"
            />
          </div>
        </DataTable>
      </div>
    </OwnerWrapper>
  );
}
