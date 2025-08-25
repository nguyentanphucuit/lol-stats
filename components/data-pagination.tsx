"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex gap-1">
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
          className="w-8 h-8 p-0"
        >
          1
        </Button>

        {currentPage > 4 && (
          <span className="flex items-center px-2 text-gray-500">...</span>
        )}

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (
            pageNum > 1 &&
            pageNum < totalPages &&
            pageNum >= currentPage - 2 &&
            pageNum <= currentPage + 2
          ) {
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          }
          return null;
        })}

        {currentPage < totalPages - 3 && (
          <span className="flex items-center px-2 text-gray-500">...</span>
        )}

        {totalPages > 1 && (
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 p-0"
          >
            {totalPages}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
