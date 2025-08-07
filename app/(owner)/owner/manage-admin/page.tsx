import { DataTable } from "@/components/DataTable";
import OwnerNavbar from "@/components/OwnerNavbar";
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
    <div>
      <OwnerNavbar title="Manage Admins" />
      <div className="container mx-auto py-5 px-5">
        <DataTable columns={adminColumn} data={data} />
      </div>
    </div>
  );
}
