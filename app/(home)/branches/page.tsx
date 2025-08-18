import { getAllBranches } from "@/api/branch";
import BranchList from "@/components/BranchList";
import SearchInput from "@/components/SearchInput";
import { tinos } from "@/components/fonts/fonts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function BranchesPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["branch"],
    queryFn: () => getAllBranches(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <div className="container mx-auto py-8 ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`${tinos.className} text-4xl font-bold text-gray-800 mb-4`}
          >
            Top Rated Branches
          </h1>
          <p className="text-[#7C7C7C] text-sm max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted aestheticians,
            <br />
            schedule your appointment hassle-free.
          </p>
        </div>
        {/* Actions Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
          </div>
        </div>
        {/* list */}
        <HydrationBoundary state={dehydratedState}>
          <BranchList />
        </HydrationBoundary>
      </div>
    </main>
  );
}
