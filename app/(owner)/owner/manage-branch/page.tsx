import { DataTable } from "@/components/DataTable";
import OwnerNavbar from "@/components/OwnerNavbar";
import { Branch } from "@/lib/types";
import { branchColumns } from "@/lib/branch-columns";

async function getData(): Promise<Branch[]> {
  
  return [
    {
      branchName: "Batangas City Branch",
      region: "Calabarzon",
      city: "Batangas City",
      barangay: "Poblacion",
      blk: "10"
    },
    {
      branchName: "Lipa City Branch",
      region: "Calabarzon",
      city: "Lipa City",
      barangay: "Barangay 101",
      blk: "5"
    },
    {
      branchName: "Sto Tomas Batangas Branch",
      region: "Calabarzon",
      city: "Sto Tomas",
      barangay: "Barangay 2",
      blk: "2"
    },
    {
      branchName: "Lemery City Branch",
      region: "Calabarzon",
      city: "Lemery City",
      barangay: "Barangay 21",
      blk: "1"
    }
  ];
}

export default async function BranchPage() {
  const data = await getData();
  return (
    <div>
      <OwnerNavbar title="Manage Branches" />
      <div className="container mx-auto py-5 px-5">
        <DataTable columns={branchColumns} data={data} />
      </div>
    </div>
  );
}
