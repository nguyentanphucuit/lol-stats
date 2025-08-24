import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { runesService } from "@/lib/runes-service";
import Image from "next/image";
import { RuneTree, SelectedRune, getTreeColor } from "./types";

interface PrimaryTreeSelectorProps {
  runeTrees: RuneTree[] | undefined;
  selectedTree: RuneTree | null;
  selectedRunes: SelectedRune[];
  onTreeSelect: (tree: RuneTree) => void;
  onRuneSelect: (rune: any, slotIndex: number, style: string) => void;
}

export function PrimaryTreeSelector({
  runeTrees,
  selectedTree,
  selectedRunes,
  onTreeSelect,
  onRuneSelect,
}: PrimaryTreeSelectorProps) {
  const renderTreeSelector = () => (
    <div className="mb-6">
      <div className="flex flex-row gap-3 items-center justify-center w-full">
        {runeTrees
          ?.sort((a, b) => a.id - b.id)
          .map((tree) => (
            <div
              key={tree.id}
              className={`p-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                selectedTree?.id === tree.id
                  ? `border-2 rounded-full ${getTreeColor(tree.id)}`
                  : ""
              }`}
              onClick={() => onTreeSelect(tree)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-pointer">
                    <div className="mx-auto relative">
                      <Image
                        src={runesService.getRuneImageUrl(tree.icon)}
                        alt={tree.name}
                        width={24}
                        height={24}
                        className="rounded"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-semibold">{tree.name}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
      </div>
    </div>
  );

  const renderRuneSlots = () => {
    if (!selectedTree) return null;

    return (
      <div className="space-y-6">
        {selectedTree.slots.map((slot, slotIndex) => (
          <div key={slotIndex}>
            <div className="mb-3">
              <h4 className="font-medium text-lg">{slot.name}</h4>
            </div>
            <div className="flex flex-wrap gap-4 w-full justify-between">
              {slot.runes.map((rune) => {
                const isSelected = selectedRunes.some(
                  (r) =>
                    r.id === rune.id &&
                    r.slotNumber === slotIndex + 1 &&
                    r.style === selectedTree.name
                );

                const hasSelectionInSlot = selectedRunes.some(
                  (r) =>
                    r.slotNumber === slotIndex + 1 &&
                    r.style === selectedTree.name
                );

                return (
                  <Tooltip key={rune.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          isSelected
                            ? `border-2 rounded-full ${getTreeColor(selectedTree.id)}`
                            : hasSelectionInSlot
                              ? "grayscale"
                              : ""
                        }`}
                        onClick={() =>
                          onRuneSelect(rune, slotIndex, selectedTree.name)
                        }
                      >
                        <Image
                          src={runesService.getRuneImageUrl(rune.icon)}
                          alt={rune.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-semibold">{rune.name}</p>
                        <p className="text-sm">{rune.shortDesc}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-48">
      {renderTreeSelector()}
      {renderRuneSlots()}
    </div>
  );
}
