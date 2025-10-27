"use client";

import { DataTable } from "@/components/DataTable";
import { customerColumns } from "@/components/columns/customer-columns";
import { CustomerRow } from "@/components/columns/customer-columns";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useAllCustomers } from "@/hooks/useAllCustomers";
import { useState } from "react";
import WalkInCustomerForm from "../forms/WalkInCustomerForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

export default function CustomerTable() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"online" | "walkin" | "">("");

  const search = searchParams.get("query") || "";
  const limit = 10;

  const { data, isFetching, isError } = useAllCustomers({
    page,
    limit,
    search,
    type,
  });

  const customers: CustomerRow[] = data?.customers ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <div className="flex justify-between items-center mb-5 gap-4">
        <div className="flex gap-3 flex-1">
          <SearchInput
            placeholder="Search by name or phone..."
            size="w-1/2"
          />
          <Select value={type || "all"} onValueChange={(value: string) => {
            setType(value === "all" ? "" : (value as "online" | "walkin"));
            setPage(1);
          }}>
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="online">Online Customers</SelectItem>
              <SelectItem value="walkin">Walk-in Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-shrink-0">
          <WalkInCustomerForm
            method="post"
            formTitle="Add Walk-in Customer"
            formDescription="Fill in the customer's name and phone number to register a walk-in customer."
            dialogButtonLabel="New Walk-in Customer"
            buttonLabel="Create Customer"
          />
        </div>
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={customerColumns}
          data={customers}
          pageCount={pagination?.total_pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
