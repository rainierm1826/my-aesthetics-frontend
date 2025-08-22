import { getAllAesthetician } from "@/api/aesthetician";
import AestheticianList from "@/components/AestheticianList";
import DropDownAvailability from "@/components/DropDownAvailability";
import DropDownBranch from "@/components/DropDownBranch";
import DropDownSex from "@/components/DropDownSex";
import SearchInput from "@/components/SearchInput";
import { tinos } from "@/components/fonts/fonts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AestheticianPage({
  searchParams,
}: {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};

  const getFirst = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const rawQuery = getFirst(sp.query);
  const rawPage = getFirst(sp.page) || "1";
  const rawLimit = getFirst(sp.limit) || "10";

  const query = rawQuery;
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 10;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["branch", "all"],
    queryFn: () => getAllAesthetician({ query, page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`${tinos.className} text-4xl font-bold text-gray-800 mb-4`}
          >
            Choose Your Aesthetician
          </h1>
          <p className="text-[#7C7C7C] text-sm max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted aestheticians.
          </p>
        </div>

        {/* Actions Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <DropDownBranch />
              <DropDownAvailability />
              <DropDownSex />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <HydrationBoundary state={dehydratedState}>
            <AestheticianList />
          </HydrationBoundary>
        </div>
      </div>
    </main>
  );
}
