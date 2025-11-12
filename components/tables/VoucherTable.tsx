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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2">
            <SearchInput placeholder="Search by code..." size="w-full" />
          </div>
          <div className="w-full sm:w-auto">
            <DropDownDiscountType useUrlParams={true} includeAllOption={true} />
          </div>
        </div>

        <div className="w-full sm:w-auto flex-shrink-0">
          <VoucherForm
            method="post"
            dialogButtonLabel="New Voucher"
            buttonLabel="Add Voucher"
            formDescription="Create a new voucher by filling in the details below."
            formTitle="Add New Voucher"
          />
        </div>
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
