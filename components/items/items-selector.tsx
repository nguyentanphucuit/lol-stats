"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/useItems";
import Image from "next/image";
import { X, Plus } from "lucide-react";
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
  selectedItems: SelectedItem[];
  onItemSelect: (item: any, slotIndex: number) => void;
  onItemRemove: (slotIndex: number) => void;
}

export function ItemsSelector({
  selectedItems,
  onItemSelect,
  onItemRemove,
}: ItemsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemList, setShowItemList] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const { items, isLoading } = useItems({
    page: 1,
    limit: 200,
    q: searchTerm,
  });

  const filteredItems = items?.items || [];

  const handleItemClick = (item: any, slotIndex: number) => {
    onItemSelect(item, slotIndex);
    setSelectedSlot(null);
    setShowItemList(false);
  };

  const handleSlotClick = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowItemList(true);
  };

  const getItemSlot = (slotIndex: number) => {
    return selectedItems.find((item) => item.slotIndex === slotIndex);
  };

  const getSlotLabel = (slotIndex: number) => {
    const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return labels[slotIndex] || `${slotIndex + 1}th`;
  };

  const calculateTotalGold = () => {
    return selectedItems.reduce((total, item) => total + item.gold, 0);
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Item Build (6 Items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Item Slots */}
          <div className="grid grid-cols-6 gap-3 mb-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const item = getItemSlot(index);
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getSlotLabel(index)}
                    </p>
                  </div>
                  <div
                    key={`slot-${index}`}
                    className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      item
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${
                      selectedSlot === index
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleSlotClick(index)}
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
                              onItemRemove(index);
                            }}
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-12 h-6 relative flex-shrink-0 flex items-center justify-center">
                                <Image
                                  src={item.icon}
                                  alt={item.name}
                                  width={36}
                                  height={36}
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
                        <div className="w-6 h-6 relative  flex items-center justify-center">
                          <Plus className="w-5 h-5 text-gray-400 mx-auto" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Gold Display */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Cost:{" "}
              </span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {calculateTotalGold().toLocaleString()} gold
              </span>
            </div>
          </div>

          {/* Item List Modal */}
          <ItemListModal
            isOpen={showItemList}
            onClose={() => setShowItemList(false)}
            onItemSelect={handleItemClick}
            selectedSlot={selectedSlot}
            items={filteredItems}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
