"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/useItems";
import Image from "next/image";
import { X, Plus, Package } from "lucide-react";
import { ItemListModal } from "./item-list-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SelectedItem {
  id: string;
  name: string;
  icon: string;
  gold: number;
  slotIndex: number;
}

interface ItemsSelectorProps {
  selectedItems1: SelectedItem[];
  selectedItems2: SelectedItem[];
  onItemSelect1: (item: any, slotIndex: number) => void;
  onItemRemove1: (slotIndex: number) => void;
  onItemSelect2: (item: any, slotIndex: number) => void;
  onItemRemove2: (slotIndex: number) => void;
  maps?: any; // Add maps data
  mapsLoading?: boolean; // Add maps loading state
}

export function ItemsSelector({
  selectedItems1,
  selectedItems2,
  onItemSelect1,
  onItemRemove1,
  onItemSelect2,
  onItemRemove2,
  maps,
  mapsLoading,
}: ItemsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemList, setShowItemList] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<1 | 2>(1);
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);

  const { items, isLoading } = useItems({
    page: 1,
    limit: 1000,
    q: searchTerm,
  });

  const filteredItems = items?.items || [];

  const handleItemClick = (item: any, slotIndex: number) => {
    if (bulkSelectionMode) {
      // In bulk mode, handle differently
      return;
    }

    if (selectedBuild === 1) {
      onItemSelect1(item, slotIndex);
    } else {
      onItemSelect2(item, slotIndex);
    }
    setSelectedSlot(null);
    setShowItemList(false);
  };

  const handleSlotClick = (slotIndex: number, build: 1 | 2) => {
    setSelectedSlot(slotIndex);
    setSelectedBuild(build);
    setBulkSelectionMode(false);
    setShowItemList(true);
  };

  const handleBulkClick = (build: 1 | 2) => {
    setSelectedBuild(build);
    setBulkSelectionMode(true);
    setShowItemList(true);
  };

  const handleBulkSave = (
    selectedItems: { item: any; slotIndex: number }[]
  ) => {
    if (selectedBuild === 1) {
      // Update only the slots that have new items, preserve existing ones
      selectedItems.forEach(({ item, slotIndex }) => {
        onItemSelect1(item, slotIndex);
      });
    } else {
      // Update only the slots that have new items, preserve existing ones
      selectedItems.forEach(({ item, slotIndex }) => {
        onItemSelect2(item, slotIndex);
      });
    }
    setShowItemList(false);
    setBulkSelectionMode(false);
  };

  const getItemSlot = (slotIndex: number, build: 1 | 2) => {
    const items = build === 1 ? selectedItems1 : selectedItems2;
    return items.find((item) => item.slotIndex === slotIndex);
  };

  const getSlotLabel = (slotIndex: number) => {
    const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return labels[slotIndex] || `${slotIndex + 1}th`;
  };

  const calculateTotalGold = (items: SelectedItem[]) => {
    return items.reduce((total, item) => total + item.gold, 0);
  };

  const renderItemBuild = (
    buildNumber: 1 | 2,
    items: SelectedItem[],
    onSelect: (item: any, slotIndex: number) => void,
    onRemove: (slotIndex: number) => void
  ) => {
    return (
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white py-2">
            Item Build {buildNumber}
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkClick(buildNumber)}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              +6 Items
            </Button>
          </div>
        </div>

        {/* Item Slots */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => {
            const item = getItemSlot(index, buildNumber);
            return (
              <div
                key={`slot-${buildNumber}-${index}`}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 justify-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getSlotLabel(index)}
                  </p>
                </div>
                <div
                  className={`relative border-2 rounded-lg p-1 cursor-pointer transition-all ${
                    item
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  } ${
                    selectedSlot === index && selectedBuild === buildNumber
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }`}
                  onClick={() => handleSlotClick(index, buildNumber)}
                >
                  {item ? (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 bg-red-100 hover:bg-red-200 dark:hover:bg-red-900/20 absolute z-10 -top-2 -right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                          }}
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-8 h-8 relative flex-shrink-0 flex items-center justify-center">
                              <Image
                                src={item.icon}
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
                                    parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${item.name.charAt(0)}</span>`;
                                  }
                                }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <div className="space-y-2">
                              <p className="font-bold text-blue-600 dark:text-blue-400">
                                {item.name}
                              </p>
                              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {item.gold.toLocaleString()} gold
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 relative flex items-center justify-center">
                        <Plus className="w-5 h-5 text-gray-400 mx-auto" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Item Builds (6 Items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Item Build 1 */}
          {renderItemBuild(1, selectedItems1, onItemSelect1, onItemRemove1)}

          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Item Build 2 */}
          {renderItemBuild(2, selectedItems2, onItemSelect2, onItemRemove2)}

          {/* Item List Modal */}
          <ItemListModal
            isOpen={showItemList}
            onClose={() => {
              setShowItemList(false);
              setBulkSelectionMode(false);
            }}
            onItemSelect={handleItemClick}
            selectedSlot={selectedSlot}
            items={filteredItems}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            bulkSelectionMode={bulkSelectionMode}
            onBulkSave={handleBulkSave}
            selectedBuild={selectedBuild}
            mapsData={maps}
            existingSelectedItems={
              bulkSelectionMode
                ? (selectedBuild === 1 ? selectedItems1 : selectedItems2).map(
                    (item) => ({
                      item: {
                        id: item.id,
                        name: item.name,
                        image: item.icon,
                        gold: { total: item.gold },
                        tags: [],
                        maps: {},
                      },
                      slotIndex: item.slotIndex,
                    })
                  )
                : []
            }
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
