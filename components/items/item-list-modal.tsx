"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataPagination } from "@/components/data-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  Save,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  image: string;
  gold: { total: number };
  tags?: string[];
  maps?: Record<string, boolean>; // Add maps property
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
  bulkSelectionMode?: boolean;
  onBulkSave?: (items: { item: Item; slotIndex: number }[]) => void;
  selectedBuild?: 1 | 2;
  mapsData?: any; // Add maps data for filtering
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
  bulkSelectionMode = false,
  onBulkSave,
  selectedBuild = 1,
  mapsData,
}: ItemListModalProps) {
  const [goldSortDirection, setGoldSortDirection] = useState<
    "none" | "asc" | "desc"
  >("desc");
  const [selectedMap, setSelectedMap] = useState<string>("11");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [bulkSelectedItems, setBulkSelectedItems] = useState<Map<number, Item>>(
    new Map()
  );

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

  // Reset bulk selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setBulkSelectedItems(new Map());
    }
  }, [isOpen]);

  const sortedItems = useMemo(() => {
    let filteredItems = items;

    if (selectedMap) {
      filteredItems = items.filter(
        (item) => item.maps && item.maps[selectedMap] === true
      );
    }

    if (goldSortDirection !== "none") {
      return [...filteredItems].sort((a, b) => {
        const goldA = a.gold?.total || 0;
        const goldB = b.gold?.total || 0;
        return goldSortDirection === "asc" ? goldA - goldB : goldB - goldA;
      });
    }

    return filteredItems;
  }, [items, goldSortDirection, selectedMap]);

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
    if (bulkSelectionMode) {
      for (let i = 0; i < 6; i++) {
        if (!bulkSelectedItems.has(i)) {
          setBulkSelectedItems((prev) => {
            const newMap = new Map(prev);
            newMap.set(i, item);
            return newMap;
          });
          break;
        }
      }
    } else if (selectedSlot !== null) {
      onItemSelect(item, selectedSlot);
    }
  };

  const handleBulkItemRemove = (slotIndex: number) => {
    setBulkSelectedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(slotIndex);
      return newMap;
    });
  };

  const handleGoldSort = (direction: "none" | "asc" | "desc") => {
    setGoldSortDirection(direction);
    resetToFirstPage();
  };

  const handleMapFilter = (mapId: string) => {
    setSelectedMap(selectedMap === mapId ? "" : mapId);
    resetToFirstPage();
  };

  const clearAllFilters = () => {
    setGoldSortDirection("desc");
    setSelectedMap("11");
    resetToFirstPage();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkSave = () => {
    if (bulkSelectedItems.size === 6 && onBulkSave) {
      const itemsArray = Array.from(bulkSelectedItems.entries()).map(
        ([slotIndex, item]) => ({
          item,
          slotIndex,
        })
      );
      onBulkSave(itemsArray);
    }
  };

  const handleCancel = () => {
    if (bulkSelectionMode) {
      setBulkSelectedItems(new Map());
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const isAllSlotsFilled = bulkSelectedItems.size === 6;
  const totalGold = Array.from(bulkSelectedItems.values()).reduce(
    (total, item) => total + item.gold.total,
    0
  );

  const getMapName = (mapId: string) => {
    if (mapsData?.data && mapsData.data[mapId]) {
      return mapsData.data[mapId].MapName || mapId;
    }
    return mapId;
  };

  const getAvailableMaps = (): [string, { MapName: string }][] => {
    if (mapsData?.data) {
      return Object.entries(mapsData.data).map(([mapId, mapInfo]) => [
        mapId,
        { MapName: (mapInfo as any)?.MapName || mapId },
      ]);
    }
    return [];
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold">
            {bulkSelectionMode
              ? `Select 6 Items for Build ${selectedBuild}`
              : `Select ${getSlotLabel(selectedSlot!)}`}
          </h3>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Bulk Selection Preview */}
        {bulkSelectionMode && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">
                Selected Items ({bulkSelectedItems.size}/6)
              </h4>
              {!isAllSlotsFilled && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  You must select exactly 6 items to save the build
                </div>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total: {totalGold.toLocaleString()} gold
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => {
                const item = bulkSelectedItems.get(index);
                const slotLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {slotLabels[index]}
                    </div>
                    <div
                      className={`w-12 h-12 border-2 rounded-lg p-1 flex items-center justify-center ${
                        item
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-dashed border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {item ? (
                        <div className="relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${item.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 bg-red-100 hover:bg-red-200 dark:hover:bg-red-900/20 absolute -top-1 -right-1"
                            onClick={() => handleBulkItemRemove(index)}
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar - Full width on mobile, flex-1 on desktop */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items by name..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>

          {/* Controls Row - Stack on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-between sm:justify-start h-10 px-4"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {goldSortDirection === "none" && "Sort by"}
                      {goldSortDirection === "asc" && "Gold ↑"}
                      {goldSortDirection === "desc" && "Gold ↓"}
                    </span>
                    <span className="sm:hidden">
                      {goldSortDirection === "none" && "Sort"}
                      {goldSortDirection === "asc" && "Cheapest"}
                      {goldSortDirection === "desc" && "Most Expensive"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-semibold">
                  Sort by Gold
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleGoldSort("none")}
                  className={`flex items-center gap-2 ${
                    goldSortDirection === "none"
                      ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                      : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span>No Sort</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleGoldSort("asc")}
                  className={`flex items-center gap-2 ${
                    goldSortDirection === "asc"
                      ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                      : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Gold ↑ (Cheapest First)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleGoldSort("desc")}
                  className={`flex items-center gap-2 ${
                    goldSortDirection === "desc"
                      ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                      : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Gold ↓ (Most Expensive First)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Map Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-between sm:justify-start h-10 px-4"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {selectedMap ? getMapName(selectedMap) : "All Maps"}
                    </span>
                    <span className="sm:hidden">
                      {selectedMap ? "Map" : "All Maps"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="font-semibold">
                  Filter by Map
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleMapFilter("")}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>All Maps</span>
                </DropdownMenuItem>
                {getAvailableMaps().length > 0 ? (
                  getAvailableMaps().map(([mapId, mapInfo]) => (
                    <DropdownMenuItem
                      key={mapId}
                      onClick={() => handleMapFilter(mapId)}
                      className={`flex items-center gap-2 ${
                        selectedMap === mapId
                          ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedMap === mapId ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>
                        {(mapInfo as { MapName: string })?.MapName || mapId}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-gray-500">
                    No maps available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Items Grid - Scrollable Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {paginatedItems.map((item: Item, itemIndex: number) => {
                const isSelected =
                  bulkSelectionMode &&
                  Array.from(bulkSelectedItems.values()).some(
                    (selectedItem) => selectedItem.id === item.id
                  );
                const selectedSlot = bulkSelectionMode
                  ? Array.from(bulkSelectedItems.entries()).find(
                      ([_, selectedItem]) => selectedItem.id === item.id
                    )?.[0]
                  : null;

                return (
                  <div
                    key={`item-${item.id || itemIndex}-slot-${selectedSlot}`}
                    className={`border rounded-lg p-3 transition-colors ${
                      isSelected
                        ? "bg-green-50 dark:bg-green-900/20 border-green-500 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => !isSelected && handleItemClick(item)}
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
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isSelected
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.gold.total.toLocaleString()} gold
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          {/* Results Summary */}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} items
          </span>

          {/* Pagination Controls - Footer */}

          {totalPages > 1 && (
            <DataPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Action Buttons */}
        {bulkSelectionMode && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkSave}
              disabled={!isAllSlotsFilled}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Items
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
