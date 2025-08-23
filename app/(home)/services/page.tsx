import DropDownBranch from "@/components/DropDownBranch";
import DropDownServiceCategory from "@/components/DropDownServiceCategory";
import SearchInput from "@/components/SearchInput";
import ServiceList from "@/components/ServiceList";
import {tinos} from "@/components/fonts/fonts"

export default function ServicesPage() {
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

        {/* Actions Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 max-w-md w-full mr-4 mb-5 sm:mb-0">
              <SearchInput placeholder="Search by name..." size="w-full" />
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <DropDownBranch />
              <DropDownServiceCategory />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <ServiceList />
      </div>
    </main>
  );
}
