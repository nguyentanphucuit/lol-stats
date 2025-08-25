"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Item {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

interface ItemsDisplayProps {
  items: Item[];
  title?: string;
  className?: string;
}

export function ItemsDisplay({
  items,
  title = "Items",
  className = "",
}: ItemsDisplayProps) {
  if (!items || items.length === 0) {
    return (
      <div
        className={`text-center text-gray-500 dark:text-gray-400 ${className}`}
      >
        <p>No {title.toLowerCase()} selected</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-row gap-2">
        {items.map((item, index) => (
          <div key={`item-${index}-${item.id}`} className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-48 text-center">{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
