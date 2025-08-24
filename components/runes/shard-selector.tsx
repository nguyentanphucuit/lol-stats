import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { StatShard } from "@/types";
import { SelectedShard, getTreeColor } from "./types";
import { STAT_PERKS_CONFIG } from "@/lib/stat-perks-config";
import { getLocaleCode } from "@/lib/locale-utils";

interface ShardSelectorProps {
  statPerks: any;
  selectedShards: SelectedShard[];
  onShardSelect: (shard: any, slotIndex: number) => void;
  locale: string;
}

export function ShardSelector({
  statPerks,
  selectedShards,
  onShardSelect,
  locale,
}: ShardSelectorProps) {
  // Get locale and stat perks directly from config
  const localeCode = getLocaleCode(locale);
  const statPerksConfig =
    STAT_PERKS_CONFIG[localeCode as keyof typeof STAT_PERKS_CONFIG] ||
    STAT_PERKS_CONFIG.en;

  const renderShardSlot = (category: string, slotIndex: number) => {
    const selectedShard = selectedShards.find((s) => s.slotIndex === slotIndex);
    const hasSelectionInSlot = selectedShards.some(
      (s) => s.slotIndex === slotIndex
    );

    const shards = statPerksConfig.filter(
      (shard: StatShard) => shard.category === category
    );

    return (
      <div key={slotIndex} className="mb-1.5">
        <div className="flex gap-1.5 items-center justify-between">
          {shards.map((shard: StatShard) => {
            const isSelected = selectedShard?.id === shard.id;

            return (
              <Tooltip key={shard.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                      isSelected
                        ? `border-2 rounded-full ${getTreeColor(8000)}`
                        : hasSelectionInSlot
                          ? "grayscale"
                          : ""
                    }`}
                    onClick={() => onShardSelect(shard, slotIndex)}
                  >
                    <Image
                      src={shard.iconUrl}
                      alt={shard.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <h2 className="font-bold text-sm text-gray-700 dark:text-gray-300">
                      {shard.category}
                    </h2>
                    <p className="font-semibold text-sm">{shard.name}</p>
                    <p className="text-sm">{shard.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderShardSlot("offense", 0)}
      {renderShardSlot("flex", 1)}
      {renderShardSlot("defense", 2)}
    </>
  );
}
