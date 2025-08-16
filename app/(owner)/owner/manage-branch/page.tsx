import { DataTable } from "@/components/DataTable";
import { branchColumns } from "@/lib/branch-columns";
import OwnerWrapper from "@/components/OwnerWrapper";
import SearchInput from "@/components/SearchInput";
import DashboardCard from "@/components/DashboardCard";
import BranchForm from "@/components/BranchForm";
import { getAllBranches } from "@/api/branch";


export default async function BranchPage() {
  const data = await getAllBranches();
  return (
    <OwnerWrapper title="Manage Branches">
      <div className="">
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <DataTable columns={branchColumns} data={data.branch}>
          <div className="flex justify-between">
            <div className="flex gap-3 w-full">
              <SearchInput placeholder="Search by name..." size="w-1/2" />
            </div>
            <BranchForm
              method="post"
              dialogButtonLabel="New Branch"
              buttonLabel="Add Branch"
              formDescription="Create a new branch by filling in the details below."
              formTitle="Add New Branch"
            />
          </div>
        </DataTable>
      </div>
    </OwnerWrapper>
  );
}
