import { DataTable } from "@/components/DataTable";
import { Branch } from "@/lib/types";
import { branchColumns } from "@/lib/branch-columns";
import OwnerWrapper from "@/components/OwnerWrapper";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import DropDownBranch from "@/components/DropDownBranch";

async function getData(): Promise<Branch[]> {
  return [
    {
      branchName: "Batangas City Branch",
      region: "Calabarzon",
      city: "Batangas City",
      barangay: "Poblacion",
      blk: "10",
      avarageRate: 4.8,
    },
    {
      branchName: "Lipa City Branch",
      region: "Calabarzon",
      city: "Lipa City",
      barangay: "Barangay 101",
      blk: "5",
      avarageRate: 4.6,
    },
    {
      branchName: "Sto Tomas Batangas Branch",
      region: "Calabarzon",
      city: "Sto Tomas",
      barangay: "Barangay 2",
      blk: "2",
      avarageRate: 4.7,
    },
    {
      branchName: "Lemery City Branch",
      region: "Calabarzon",
      city: "Lemery City",
      barangay: "Barangay 21",
      blk: "1",
      avarageRate: 4.5,
    },
  ];
}

export default async function BranchPage() {
  const data = await getData();
  return (
    <OwnerWrapper title="Manage Branches">
      <div className="">
        <DataTable columns={branchColumns} data={data}>
          <div className="flex justify-between">
            <div className="flex gap-3 w-full">
              <SearchInput placeholder="Search by name..." />
              <DropDownBranch />
            </div>
            <Button>New Branch</Button>
          </div>
        </DataTable>
      </div>
    </OwnerWrapper>
  );
}
