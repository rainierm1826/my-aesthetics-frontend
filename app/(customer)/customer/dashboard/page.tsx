import AestheticianSelectionClient from "@/components/lists/AestheticianSelectionList";
import BranchSelectionList from "@/components/lists/BranchSelectionList";
import ServiceSelectionList from "@/components/lists/ServiceSelectionList";
import StepIndicator from "@/components/StepIndicator";
import WaitingList from "@/components/WaitingList";
import CustomerWrapper from "@/components/wrapper/CustomerWrapper";
import { apiRequest } from "@/lib/function";
import { Branch, BranchListResponse } from "@/lib/types/branch-types";

export async function getBranchesForServer(): Promise<Branch[]> {
  try {
    const response = await apiRequest<BranchListResponse>("/branch");
    return response.branch || [];
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
}

export default async function CustomerDashboard() {
  const branches: Branch[] = await getBranchesForServer();

  return (
    <CustomerWrapper>
      <div className="flex flex-col md:flex-row min-h-screen gap-2">
        {/* side (waiting list) */}
        <div className="md:w-80 w-full order-2 md:order-1 md:h-screen">
          <WaitingList />
        </div>

        {/* main */}
        <div className="flex-1 flex justify-center items-center order-1 md:order-2 shadow-sm">
          <div className="flex-1 overflow-y-auto p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-gray-600 mb-6">
              Follow the steps to complete your booking
            </p>
            <StepIndicator />

            <BranchSelectionList initialBranches={branches} />
            <ServiceSelectionList />
            <AestheticianSelectionClient />
          </div>
        </div>
      </div>
    </CustomerWrapper>
  );
}
