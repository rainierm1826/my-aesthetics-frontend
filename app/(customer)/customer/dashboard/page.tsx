import BookingFlow from "@/components/BookingFlow";
import CustomerWrapper from "@/components/wrapper/CustomerWrapper";

export default async function CustomerDashboard() {
  return (
    <CustomerWrapper>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex justify-center items-center md:shadow-sm">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Follow the steps to complete your booking
            </p>
            <BookingFlow />
          </div>
        </div>
      </div>
    </CustomerWrapper>
  );
}
