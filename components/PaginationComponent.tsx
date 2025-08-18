"use client";

import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  pageCount?: number;
  windowSize?: number;
};

const PaginationComponent: React.FC<Props> = ({
  pageCount = 1,
  windowSize = 1,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const pages = useMemo(() => {
    const total = Math.max(1, pageCount);
    const cur = Math.min(Math.max(1, currentPage), total);
    const start = Math.max(1, cur - windowSize);
    const end = Math.min(total, cur + windowSize);
    const arr = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return { arr, cur, total };
  }, [pageCount, currentPage, windowSize]);

  function updatePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    if (Number(limit) === 10) params.delete("limit");
    else params.set("limit", String(limit));

    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.replace(url, { scroll: false });
  }

  const canPrev = pages.cur > 1;
  const canNext = pages.cur < pages.total;

  return (
    <Pagination className="flex items-center gap-2">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"ghost"}
            aria-label="Previous page"
            onClick={() => canPrev && updatePage(pages.cur - 1)}
            disabled={!canPrev}
            className="text-[#7C7C7C] disabled:opacity-40"
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>

        <PaginationItem>
          {pages.arr.map((p) => (
            <PaginationLink
              key={p}
              onClick={() => updatePage(p)}
              aria-current={p === pages.cur ? "page" : undefined}
              className={`px-2 py-1 rounded-sm ${
                p === pages.cur ? "bg-[#FBF9F2] text-black" : ""
              }`}
            >
              {p}
            </PaginationLink>
          ))}
        </PaginationItem>

        <PaginationItem>
          <Button
            variant={"ghost"}
            aria-label="Next page"
            onClick={() => canNext && updatePage(pages.cur + 1)}
            disabled={!canNext}
            className="text-[#7C7C7C] disabled:opacity-40"
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
