import DashboardCard from "@/components/DashboardCard";
import { DataTable } from "@/components/DataTable";
import OwnerWrapper from "@/components/OwnerWrapper";
import SearchInput from "@/components/SearchInput";
import { Voucher } from "@/lib/types";
import { voucherColumn } from "@/lib/voucher-column";
import VoucherForm from "@/components/VoucherForm";

async function getData(): Promise<Voucher[]> {
  return [
    { voucherCode: "WELCOME10", discountAmount: 100, quantity: 50 },
    { voucherCode: "SUMMER15", discountAmount: 150, quantity: 40 },
    { voucherCode: "SAVE20", discountAmount: 200, quantity: 30 },
    { voucherCode: "FREESHIP", discountAmount: 50, quantity: 100 },
    { voucherCode: "NEWUSER25", discountAmount: 250, quantity: 20 },
    { voucherCode: "FLASH30", discountAmount: 300, quantity: 10 },
    { voucherCode: "VIP35", discountAmount: 350, quantity: 5 },
    { voucherCode: "HOLIDAY40", discountAmount: 400, quantity: 15 },
    { voucherCode: "BIRTHDAY50", discountAmount: 500, quantity: 8 },
    { voucherCode: "MEGA60", discountAmount: 600, quantity: 3 },
  ];
}

export default async function VoucherPage() {
  const data = await getData();

  return (
    <OwnerWrapper title="Manage Vouchers">
      <div>
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <div className="flex justify-between mb-5">
          <div className="flex gap-3 w-full">
            <SearchInput placeholder="Search by voucher code..." size="w-1/2" />
          </div>
          <VoucherForm
            dialogButtonLabel="New Voucher"
            buttonLabel="Add Voucher"
            formDescription="Create a new voucher by filling in the details below."
            formTitle="Add New Voucher"
          />
        </div>
        <DataTable columns={voucherColumn} data={data} />
      </div>
    </OwnerWrapper>
  );
}
