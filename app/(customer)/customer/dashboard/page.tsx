import BookingFlow from "@/components/BookingFlow";
import WaitingList from "@/components/WaitingList";
import CustomerWrapper from "@/components/wrapper/CustomerWrapper";

export default async function CustomerDashboard() {
  return (
    <CustomerWrapper>
      <div className="flex flex-col md:flex-row min-h-screen md:gap-2">
        {/* side (waiting list) */}
        <div className="md:w-80 w-full order-2 md:order-1 md:h-screen">
          <WaitingList />
        </div>

        {/* main */}
        <div className="flex-1 flex justify-center items-center order-1 md:order-2 md:shadow-sm">
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
