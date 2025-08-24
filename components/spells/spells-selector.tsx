"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSpells } from "@/hooks/useSpells";
import { spellsService } from "@/lib/spells-service";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SelectedSpell {
  id: string;
  name: string;
  icon: string;
  slotIndex: number;
}

interface SpellsSelectorProps {
  selectedSpells: SelectedSpell[];
  onSpellSelect: (spell: any, slotIndex: number) => void;
  onSpellRemove: (slotIndex: number) => void;
}

export function SpellsSelector({
  selectedSpells,
  onSpellSelect,
  onSpellRemove,
}: SpellsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSpellList, setShowSpellList] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const { spells, isLoading } = useSpells({
    page: 1,
    limit: 200,
    q: searchTerm,
  });

  const filteredSpells = spells?.spells || [];

  const handleSpellClick = (spell: any, slotIndex: number) => {
    // Only proceed if spell has required properties
    if (spell && spell.id && spell.name && spell.image && spell.image.full) {
      onSpellSelect(spell, slotIndex);
      setSelectedSlot(null);
      setShowSpellList(false);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowSpellList(true);
  };

  const getSpellSlot = (slotIndex: number) => {
    return selectedSpells.find((spell) => spell.slotIndex === slotIndex);
  };

  const getSlotLabel = (slotIndex: number) => {
    const labels = ["1st", "2nd"];
    return labels[slotIndex] || `${slotIndex + 1}th`;
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Spells (2 Spells)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Spell Slots */}
          <div className="flex flex-row items-center justify-center gap-3 mb-4">
            {Array.from({ length: 2 }).map((_, index) => {
              const spell = getSpellSlot(index);
              return (
                <div key={index} className="w-12 h-12 flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getSlotLabel(index)}
                    </p>
                  </div>
                  <div
                    className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      spell
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${
                      selectedSlot === index
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleSlotClick(index)}
                  >
                    {spell ? (
                      <>
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 bg-red-100 hover:bg-red-200 dark:hover:bg-red-900/20 absolute z-10 -top-2 -right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSpellRemove(index);
                            }}
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-12 h-6 relative flex-shrink-0 flex items-center justify-center">
                                {spell.icon && spell.icon !== "" ? (
                                  <Image
                                    src={spell.icon}
                                    alt={spell.name}
                                    width={36}
                                    height={36}
                                    className="rounded object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.currentTarget as HTMLImageElement;
                                      target.style.display = "none";
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${spell.name.charAt(0)}</span>`;
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    {spell.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-sm">
                              <div className="space-y-2">
                                <p className="font-bold text-blue-600 dark:text-blue-400">
                                  {spell.name}
                                </p>
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

          {/* Spell List Modal */}
          {showSpellList && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Select Summoner Spell
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSpellList(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search spells..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading spells...</p>
                    </div>
                  ) : (
                    filteredSpells.map((spell: any) => {
                      // Check if this spell is already selected in the other slot
                      const isAlreadySelected = selectedSpells.some(
                        (selectedSpell) =>
                          selectedSpell.id === spell.id &&
                          selectedSpell.slotIndex !== selectedSlot
                      );

                      return (
                        <div
                          key={spell.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg ${
                            isAlreadySelected
                              ? "border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50"
                              : "border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          onClick={
                            isAlreadySelected
                              ? undefined
                              : () => handleSpellClick(spell, selectedSlot!)
                          }
                        >
                          {spell.image && spell.image.full ? (
                            <Image
                              src={spellsService.getSpellImageUrl(
                                spell.image.full
                              )}
                              alt={spell.name}
                              width={32}
                              height={32}
                              className="rounded object-cover"
                              onError={(e) => {
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${spell.name.charAt(0)}</span>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                {spell.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {spell.name}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
