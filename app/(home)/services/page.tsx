import { getAllService } from "@/api/service";
import ServiceList from "@/components/lists/ServiceList";
import { tinos } from "@/components/fonts/fonts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ServicesPage({
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
    queryFn: () => getAllService({ query, page, limit }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-6 my-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`${tinos.className} text-4xl font-bold text-gray-800 mb-4`}
          >
            Our Services
          </h1>
          <p className="text-[#7C7C7C] text-sm max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted aestheticians,
            <br />
            schedule your appointment hassle-free.
          </p>
        </div>
        <HydrationBoundary state={dehydratedState}>
          <ServiceList action />
        </HydrationBoundary>
      </div>
    </main>
  );
}
