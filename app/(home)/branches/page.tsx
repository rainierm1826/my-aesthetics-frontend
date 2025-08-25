import { getAllBranches } from "@/api/branch";
import BranchList from "@/components/BranchList";
import { tinos } from "@/components/fonts/fonts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function BranchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
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
    queryFn: () => getAllBranches({ query, page, limit }),
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

        {/* list */}
        <HydrationBoundary state={dehydratedState}>
          <BranchList action />
        </HydrationBoundary>
      </div>
    </main>
  );
}
