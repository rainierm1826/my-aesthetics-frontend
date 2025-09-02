"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useVouchers } from "@/hooks/useVouchers";
import { Voucher } from "@/lib/types/voucher-type";
import VoucherForm from "../forms/VoucherForm";
import { voucherColumn } from "@/components/columns/voucher-column";
import DropDownDiscountType from "../selects/DropDownDiscountType";

export default function VoucherTable() {
  const { data, isFetching, isError } = useVouchers();

  const vouchers: Voucher[] = data?.voucher ?? [];

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-3 w-full">
          <SearchInput placeholder="Search by code..." size="w-1/2" />
          <DropDownDiscountType useUrlParams={true} includeAllOption={true} />
        </div>

        <VoucherForm
          method="post"
          dialogButtonLabel="New Voucher"
          buttonLabel="Add Voucher"
          formDescription="Create a new voucher by filling in the details below."
          formTitle="Add New Voucher"
        />
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={voucherColumn}
          data={vouchers}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
