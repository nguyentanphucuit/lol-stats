"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryTreeSelector } from "./primary-tree-selector";
import { SecondaryTreeSelector } from "./secondary-tree-selector";
import { ShardSelector } from "./shard-selector";
import type { RuneTree, SelectedRune, SelectedShard } from "./types";

interface RuneBuildSectionProps {
  runeTrees: RuneTree[];
  selectedTree: RuneTree | null;
  selectedSecondaryTree: RuneTree | null;
  selectedRunes: SelectedRune[];
  selectedShards: SelectedShard[];
  runeTreesLoading: boolean;
  statPerksLoading: boolean;
  spellsLoading: boolean;
  enabled: boolean; // New prop to enable/disable selection
  onTreeSelect: (tree: RuneTree) => void;
  onSecondaryTreeSelect: (tree: RuneTree) => void;
  onRuneSelect: (rune: any, slotIndex: number, style: string) => void;
  onShardSelect: (shard: any, slotIndex: number) => void;
  locale: string;
}

export function RuneBuildSection({
  runeTrees,
  selectedTree,
  selectedSecondaryTree,
  selectedRunes,
  selectedShards,
  runeTreesLoading,
  statPerksLoading,
  spellsLoading,
  enabled,
  onTreeSelect,
  onSecondaryTreeSelect,
  onRuneSelect,
  onShardSelect,
  locale,
}: RuneBuildSectionProps) {
  return (
    <Card className="w-full md:w-96">
      <CardHeader>
        <CardTitle>Rune Build</CardTitle>
      </CardHeader>
      <CardContent>
        {runeTreesLoading || statPerksLoading || spellsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Loading rune trees, stat perks, or spells...
            </p>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8 justify-center items-center">
            {/* Primary Tree */}
            <PrimaryTreeSelector
              runeTrees={runeTrees}
              selectedTree={selectedTree}
              selectedRunes={selectedRunes}
              onTreeSelect={enabled ? onTreeSelect : () => {}}
              onRuneSelect={enabled ? onRuneSelect : () => {}}
            />

            {/* Secondary Tree */}
            <div className="w-32">
              <SecondaryTreeSelector
                runeTrees={runeTrees}
                selectedTree={selectedTree}
                selectedSecondaryTree={selectedSecondaryTree}
                selectedRunes={selectedRunes}
                onSecondaryTreeSelect={
                  enabled ? onSecondaryTreeSelect : () => {}
                }
                onRuneSelect={enabled ? onRuneSelect : () => {}}
              />

              {/* Shards */}
              <ShardSelector
                statPerks={[]}
                selectedShards={selectedShards}
                onShardSelect={enabled ? onShardSelect : () => {}}
                locale={locale}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
