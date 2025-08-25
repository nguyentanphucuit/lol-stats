"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  image: string;
  gold: { total: number };
  tags?: string[];
  depth?: number; // Add depth property for sorting
}

interface ItemListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSelect: (item: Item, slotIndex: number) => void;
  selectedSlot: number | null;
  items: Item[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ItemListModal({
  isOpen,
  onClose,
  onItemSelect,
  selectedSlot,
  items,
  isLoading,
  searchTerm,
  onSearchChange,
}: ItemListModalProps) {
  const [goldSortDirection, setGoldSortDirection] = useState<
    "none" | "asc" | "desc"
  >("desc"); // Default to descending order (most expensive first)
  const [selectedDepth, setSelectedDepth] = useState<number | null>(3); // Default to depth 3
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Show 50 items per page
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
        resetToFirstPage(); // Reset to first page when search changes
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, onSearchChange]);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Sort function by gold (only sorts the items array, no params changed)
  const sortedItems = useMemo(() => {
    let filteredItems = items;

    // Filter by selected depth if any
    if (selectedDepth !== null) {
      filteredItems = items.filter(
        (item) => (item.depth || 0) === selectedDepth
      );
    }

    // Sort by gold if enabled
    if (goldSortDirection !== "none") {
      return [...filteredItems].sort((a, b) => {
        const goldA = a.gold?.total || 0;
        const goldB = b.gold?.total || 0;

        if (goldSortDirection === "asc") {
          return goldA - goldB; // Ascending order by gold cost (cheapest first)
        } else {
          return goldB - goldA; // Descending order by gold cost (most expensive first)
        }
      });
    }

    return filteredItems;
  }, [items, goldSortDirection, selectedDepth]);

  // Pagination logic
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const getSlotLabel = (slotIndex: number) => {
    const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return labels[slotIndex] || `${slotIndex + 1}th`;
  };

  const handleItemClick = (item: Item) => {
    if (selectedSlot !== null) {
      onItemSelect(item, selectedSlot);
    }
  };

  const handleGoldSort = (direction: "none" | "asc" | "desc") => {
    setGoldSortDirection(direction);
    resetToFirstPage();
  };

  const handleDepthFilter = (depth: number | null) => {
    setSelectedDepth(selectedDepth === depth ? null : depth);
    resetToFirstPage();
  };

  const clearAllFilters = () => {
    setGoldSortDirection("desc"); // Reset to default instead of "none"
    setSelectedDepth(3); // Reset to default instead of null
    resetToFirstPage();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Early return must come AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold">
            Select {getSlotLabel(selectedSlot!)}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex gap-3 mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={goldSortDirection === "none" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGoldSort("none")}
              className="whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              No Sort
            </Button>
            <Button
              variant={goldSortDirection === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGoldSort("asc")}
              className="whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Gold ↑
            </Button>
            <Button
              variant={goldSortDirection === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGoldSort("desc")}
              className="whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Gold ↓
            </Button>
          </div>
        </div>

        {/* Depth Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <Button
            variant={selectedDepth === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleDepthFilter(null)}
            className="whitespace-nowrap"
          >
            All Depth
          </Button>
          <Button
            variant={selectedDepth === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleDepthFilter(1)}
            className="whitespace-nowrap"
          >
            Depth 1
          </Button>
          <Button
            variant={selectedDepth === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleDepthFilter(2)}
            className="whitespace-nowrap"
          >
            Depth 2
          </Button>
          <Button
            variant={selectedDepth === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => handleDepthFilter(3)}
            className="whitespace-nowrap"
          >
            Depth 3
          </Button>
          {(selectedDepth !== null || goldSortDirection !== "none") && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mb-4 flex-shrink-0"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Clear All Filters Button */}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} items
          </span>
          {totalPages > 1 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* Items Grid - Scrollable Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading items...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paginatedItems.map((item: Item, itemIndex: number) => (
                  <div
                    key={`item-${item.id || itemIndex}-slot-${selectedSlot}`}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${item.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.gold.total.toLocaleString()} gold
                        </p>
                        {item.depth !== undefined && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Depth: {item.depth}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags
                          .slice(0, 2)
                          .map((tag: string, tagIndex: number) => (
                            <Badge
                              key={`${item.id || itemIndex}-tag-${tagIndex}`}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
