import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TablePaginationProps {
  /** 1-based current page */
  page: number;
  /** Page size (items per page) */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when page changes (1-based) */
  onPageChange: (page: number) => void;
  /** Called when page size changes (optional) */
  onLimitChange?: (limit: number) => void;
  /** Page size options when onLimitChange is provided */
  limitOptions?: number[];
  /** Optional label for the count, e.g. "results" */
  itemLabel?: string;
  className?: string;
}

const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100];

export function TablePagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  itemLabel = "results",
  className,
}: TablePaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const showPrev = page > 1;
  const showNext = page < totalPages;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {start}–{end} of {total} {itemLabel}
        </span>
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span>Per page</span>
            <Select
              value={String(limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px] border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <Button
              variant="ghost"
              size="default"
              className="gap-1 pl-2.5 h-9"
              onClick={() => onPageChange(page - 1)}
              disabled={!showPrev}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          </PaginationItem>
          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <Button
                  variant={page === p ? "outline" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onPageChange(p)}
                  aria-current={page === p ? "page" : undefined}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </Button>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <Button
              variant="ghost"
              size="default"
              className="gap-1 pr-2.5 h-9"
              onClick={() => onPageChange(page + 1)}
              disabled={!showNext}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
