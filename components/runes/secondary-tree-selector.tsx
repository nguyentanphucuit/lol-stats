import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { runesService } from "@/lib/runes-service";
import Image from "next/image";
import { RuneTree, SelectedRune, getTreeColor } from "./types";

interface SecondaryTreeSelectorProps {
  runeTrees: RuneTree[] | undefined;
  selectedTree: RuneTree | null;
  selectedSecondaryTree: RuneTree | null;
  selectedRunes: SelectedRune[];
  onSecondaryTreeSelect: (tree: RuneTree) => void;
  onRuneSelect: (rune: any, slotIndex: number, style: string) => void;
}

export function SecondaryTreeSelector({
  runeTrees,
  selectedTree,
  selectedSecondaryTree,
  selectedRunes,
  onSecondaryTreeSelect,
  onRuneSelect,
}: SecondaryTreeSelectorProps) {
  const renderSecondaryTreeSelector = () => {
    if (!selectedTree) return null;

    // Filter out the primary tree from secondary options
    const availableSecondaryTrees =
      runeTrees?.filter((tree) => tree.id !== selectedTree.id) || [];

    return (
      <div className="mb-4">
        <div className="flex flex-row gap-3 items-center justify-center w-full">
          {availableSecondaryTrees
            .sort((a, b) => a.id - b.id)
            .map((tree) => (
              <div
                key={tree.id}
                className={`p-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  selectedSecondaryTree?.id === tree.id
                    ? `border-2 rounded-full ${getTreeColor(tree.id)}`
                    : ""
                }`}
                onClick={() => onSecondaryTreeSelect(tree)}
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
  };

  const renderSecondaryRuneSlots = () => {
    if (!selectedSecondaryTree) return null;

    // Count how many secondary slots are already selected
    const selectedSecondarySlots = selectedRunes.filter(
      (r) => r.style === selectedSecondaryTree.name
    ).length;

    return (
      <div className="space-y-2 mb-4">
        {selectedSecondaryTree.slots.slice(1).map((slot, slotIndex) => {
          const actualSlotNumber = slotIndex + 2; // +2 because we skip slot 1
          const isSelected = selectedRunes.some(
            (r) =>
              r.id === slot.runes[0]?.id &&
              r.slotNumber === actualSlotNumber &&
              r.style === selectedSecondaryTree.name
          );

          const hasSelectionInSlot = selectedRunes.some(
            (r) =>
              r.slotNumber === actualSlotNumber &&
              r.style === selectedSecondaryTree.name
          );

          // Check if this slot should be grayed out (when max 2 slots are selected)
          const shouldGrayOut =
            selectedSecondarySlots >= 2 && !hasSelectionInSlot;

          return (
            <div key={actualSlotNumber}>
              <div className="mb-3">
                <h4 className="font-medium text-lg">{slot.name}</h4>
              </div>
              <div className="flex flex-wrap gap-4 w-full justify-between">
                {slot.runes.map((rune) => {
                  const isRuneSelected = selectedRunes.some(
                    (r) =>
                      r.id === rune.id &&
                      r.slotNumber === actualSlotNumber &&
                      r.style === selectedSecondaryTree.name
                  );

                  return (
                    <Tooltip key={rune.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                            isRuneSelected
                              ? `border-2 rounded-full ${getTreeColor(selectedSecondaryTree.id)}`
                              : hasSelectionInSlot
                                ? "grayscale"
                                : shouldGrayOut
                                  ? "grayscale opacity-50"
                                  : ""
                          }`}
                          onClick={() => {
                            onRuneSelect(
                              rune,
                              slotIndex + 1,
                              selectedSecondaryTree.name
                            );
                          }}
                        >
                          <Image
                            src={runesService.getRuneImageUrl(rune.icon)}
                            alt={rune.name}
                            width={28}
                            height={28}
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
          );
        })}
      </div>
    );
  };

  return (
    <>
      {renderSecondaryTreeSelector()}
      {renderSecondaryRuneSlots()}
    </>
  );
}
