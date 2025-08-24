"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface Item {
  id: string;
  name: string;
  image: string;
  gold: { total: number };
  tags?: string[];
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
  if (!isOpen) return null;

  const getSlotLabel = (slotIndex: number) => {
    const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return labels[slotIndex] || `${slotIndex + 1}th`;
  };

  const handleItemClick = (item: Item) => {
    if (selectedSlot !== null) {
      onItemSelect(item, selectedSlot);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Select {getSlotLabel(selectedSlot!)}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items Grid */}
        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item: Item, itemIndex: number) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
