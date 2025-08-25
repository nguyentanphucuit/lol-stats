"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Spell {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

interface SpellDisplayProps {
  spells: Spell[];
  className?: string;
}

export function SpellDisplay({ spells, className = "" }: SpellDisplayProps) {
  if (!spells || spells.length === 0) {
    return (
      <div
        className={`text-center text-gray-500 dark:text-gray-400 ${className}`}
      >
        <p>No spells selected</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center items-center gap-2 ${className}`}
    >
      <div className="flex gap-2 justify-center">
        {spells.map((spell, index) => (
          <div key={`spell-${index}-${spell.id}`} className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Image
                      src={spell.icon}
                      alt={spell.name}
                      width={32}
                      height={32}
                      className="rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{spell.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
