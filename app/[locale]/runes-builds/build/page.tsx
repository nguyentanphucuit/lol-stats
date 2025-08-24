"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocale } from "@/components/providers/locale-provider";
import { getLocaleCode } from "@/lib/locale-utils";
import { useChampions } from "@/hooks/useChampions";
import { useRuneTrees } from "@/hooks/useRuneTrees";
import { useStatPerks } from "@/hooks/useStatPerks";
import { runesService } from "@/lib/runes-service";
import Image from "next/image";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { PrimaryTreeSelector } from "@/components/runes/primary-tree-selector";
import { SecondaryTreeSelector } from "@/components/runes/secondary-tree-selector";
import { ShardSelector } from "@/components/runes/shard-selector";
import { SaveBuildModal } from "@/components/runes/save-build-modal";
import { ChampionSection } from "@/components/champions/champion-section";
import { ChampionSelectorModal } from "@/components/champions/champion-selector-modal";
import { ItemsSelector, SelectedItem } from "@/components/items/items-selector";
import {
  ModeSelector,
  GAME_MODES,
} from "@/components/game-modes/mode-selector";
import type { Champion } from "@/components/champions/champion-section";
import type { GameMode } from "@/components/game-modes/mode-selector";
import {
  RuneTree,
  SelectedRune,
  SelectedShard,
} from "@/components/runes/types";

export default function RuneBuilderPage() {
  const { locale } = useLocale();
  const currentLocaleCode = getLocaleCode(locale);

  // State
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(
    null
  );
  const [showChampionSelector, setShowChampionSelector] = useState(false);
  const [selectedRunes, setSelectedRunes] = useState<SelectedRune[]>([]);
  const [selectedTree, setSelectedTree] = useState<RuneTree | null>(null);
  const [selectedSecondaryTree, setSelectedSecondaryTree] =
    useState<RuneTree | null>(null);
  const [selectedShards, setSelectedShards] = useState<SelectedShard[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { champions, isLoading: championsLoading } = useChampions({
    page: 1,
    limit: 200, // Increased to fetch all champions (LoL has ~160+ champions)
    q: "",
  });

  const { runeTrees, isLoading: runeTreesLoading } = useRuneTrees();
  const { statPerks, isLoading: statPerksLoading } = useStatPerks({
    page: 1,
    limit: 200, // Increased to fetch all stat perks
  });

  // Effects
  useEffect(() => {
    if (runeTrees && runeTrees.length > 0 && !selectedTree) {
      setSelectedTree(runeTrees[0]);
    }
  }, [runeTrees, selectedTree]);

  // Auto-select first game mode
  useEffect(() => {
    if (!selectedMode) {
      setSelectedMode(GAME_MODES[0]);
    }
  }, [selectedMode]);

  // Auto-select first available secondary tree when primary tree changes
  useEffect(() => {
    if (selectedTree && runeTrees && runeTrees.length > 0) {
      const availableSecondaryTrees = runeTrees.filter(
        (tree) => tree.id !== selectedTree.id
      );
      if (availableSecondaryTrees.length > 0 && !selectedSecondaryTree) {
        setSelectedSecondaryTree(availableSecondaryTrees[0]);
      }
    }
  }, [selectedTree, runeTrees, selectedSecondaryTree]);

  // Event handlers
  const handleChampionSelect = (champion: Champion) => {
    setSelectedChampion(champion);
    setShowChampionSelector(false);
  };

  const handleTreeSelect = (tree: RuneTree) => {
    setSelectedTree(tree);
    setSelectedRunes([]);
    setSelectedSecondaryTree(null); // Reset secondary tree when primary changes
  };

  const handleSecondaryTreeSelect = (tree: RuneTree) => {
    setSelectedSecondaryTree(tree);
  };

  const handleShardSelect = (shard: any, slotIndex: number) => {
    const newShard: SelectedShard = {
      id: shard.id,
      name: shard.name,
      icon: shard.iconUrl,
      slotIndex,
      category: shard.category,
    };

    setSelectedShards((prev) => {
      const filtered = prev.filter((s) => s.slotIndex !== slotIndex);
      return [...filtered, newShard];
    });
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleItemSelect = (item: any, slotIndex: number) => {
    const newItem: SelectedItem = {
      id: item.id,
      name: item.name,
      icon: item.image, // Use the full image URL from API
      gold: item.gold.total,
      slotIndex,
    };

    setSelectedItems((prev) => {
      const filtered = prev.filter((i) => i.slotIndex !== slotIndex);
      return [...filtered, newItem];
    });
  };

  const handleItemRemove = (slotIndex: number) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.slotIndex !== slotIndex)
    );
  };

  const isBuildComplete = () => {
    // Check if we have all required selections
    if (
      !selectedMode ||
      !selectedTree ||
      !selectedSecondaryTree ||
      selectedRunes.length === 0 ||
      selectedShards.length === 0 ||
      selectedItems.length < 6
    ) {
      return false;
    }

    // Check if we have all 4 primary runes (slots 1-4)
    const primaryRunes = selectedRunes.filter(
      (r) => r.style === selectedTree.name
    );
    if (primaryRunes.length < 4) {
      return false;
    }

    // Check if we have exactly 2 secondary runes
    const secondaryRunes = selectedRunes.filter(
      (r) => r.style === selectedSecondaryTree.name
    );
    if (secondaryRunes.length < 2) {
      return false;
    }

    // Check if we have all 3 stat shards
    if (selectedShards.length < 3) {
      return false;
    }

    // Check if we have all 6 items
    if (selectedItems.length < 6) {
      return false;
    }

    return true;
  };

  const handleSaveBuild = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);

      // Validate required data
      if (!selectedTree || !selectedSecondaryTree || !selectedMode) {
        throw new Error("Missing required build data");
      }

      // Validate that IDs exist
      if (!selectedTree.id || !selectedSecondaryTree.id || !selectedMode.id) {
        throw new Error("Missing required build IDs");
      }

      // Prepare data for API
      const primaryRunes = selectedRunes
        .filter((r) => r.style === selectedTree.name)
        .sort((a, b) => a.slotNumber - b.slotNumber)
        .map((rune) => ({
          ...rune,
          id: rune.id?.toString() || String(rune.id), // Safe conversion with fallback
        }));

      const secondaryRunes = selectedRunes
        .filter((r) => r.style === selectedSecondaryTree.name)
        .sort((a, b) => a.slotNumber - b.slotNumber)
        .map((rune) => ({
          ...rune,
          id: rune.id?.toString() || String(rune.id), // Safe conversion with fallback
        }));

      const buildData = {
        championKey: selectedChampion?.id?.toString(),
        championName: selectedChampion?.name,
        gameMode: selectedMode.id,
        primaryTreeId: selectedTree.id.toString(),
        primaryTreeName: selectedTree.name,
        secondaryTreeId: selectedSecondaryTree.id.toString(),
        secondaryTreeName: selectedSecondaryTree.name,
        primaryRunes,
        secondaryRunes,
        statShards: selectedShards
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((shard) => ({
            ...shard,
            id: shard.id?.toString() || String(shard.id), // Safe conversion with fallback
          })),
        selectedItems: selectedItems
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((item) => ({
            ...item,
            id: item.id?.toString() || String(item.id), // Safe conversion with fallback
          })),
      };

      // Save to database via API
      let response;
      try {
        response = await fetch("/api/rune-builds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildData),
        });
      } catch (fetchError) {
        throw new Error(
          `Network error: ${fetchError instanceof Error ? fetchError.message : "Unknown fetch error"}`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      // Show success message
      alert("Rune build saved successfully to database!");

      // Reset form or close modal
      setShowSaveModal(false);

      // Optionally reset selections
      // setSelectedRunes([]);
      // setSelectedShards([]);
    } catch (error) {
      console.error("Error saving rune build:", error);
      alert(
        `Failed to save rune build: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRuneSelect = (rune: any, slotIndex: number, style: string) => {
    const newRune: SelectedRune = {
      id: rune.id,
      name: rune.name,
      icon: rune.icon,
      slotNumber: slotIndex + 1, // Convert to 1-based slot numbers
      style,
    };

    setSelectedRunes((prev) => {
      // Check if this is a secondary tree selection
      const isSecondaryTree =
        selectedSecondaryTree && style === selectedSecondaryTree.name;

      if (isSecondaryTree) {
        // For secondary tree: 1 rune per slot, max 2 total
        const secondaryRunes = prev.filter((r) => r.style === style);
        const currentSlotRunes = prev.filter(
          (r) => r.slotNumber === slotIndex + 1 && r.style === style
        );

        // If selecting in a slot that already has a rune, replace it
        if (currentSlotRunes.length > 0) {
          const filtered = prev.filter(
            (r) => !(r.slotNumber === slotIndex + 1 && r.style === style)
          );
          return [...filtered, newRune];
        }

        // If we're at max 2 runes, remove the oldest one
        if (secondaryRunes.length >= 2) {
          const oldestSecondaryRune = secondaryRunes[0];
          const filtered = prev.filter((r) => r.id !== oldestSecondaryRune.id);
          return [...filtered, newRune];
        }
      }

      // For primary tree or when under limit, use normal logic
      const filtered = prev.filter(
        (r) => !(r.slotNumber === slotIndex + 1 && r.style === style)
      );
      const result = [...filtered, newRune];
      return result;
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/${currentLocaleCode}/runes-builds`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rune Trees
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rune Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create custom rune builds for your champions
              </p>
            </div>
          </div>

          {/* Right Column - Rune Selection */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <ChampionSection
                selectedChampion={selectedChampion}
                onShowChampionSelector={() => setShowChampionSelector(true)}
              />
              <ModeSelector
                selectedMode={selectedMode}
                onModeSelect={handleModeSelect}
              />
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Rune Build</CardTitle>
                </CardHeader>
                <CardContent>
                  {runeTreesLoading || statPerksLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">
                        Loading rune trees...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col xl:flex-row gap-8">
                      {/* Primary Tree */}
                      <PrimaryTreeSelector
                        runeTrees={runeTrees}
                        selectedTree={selectedTree}
                        selectedRunes={selectedRunes}
                        onTreeSelect={handleTreeSelect}
                        onRuneSelect={handleRuneSelect}
                      />

                      {/* Secondary Tree */}
                      <div className="w-full xl:w-32">
                        <SecondaryTreeSelector
                          runeTrees={runeTrees}
                          selectedTree={selectedTree}
                          selectedSecondaryTree={selectedSecondaryTree}
                          selectedRunes={selectedRunes}
                          onSecondaryTreeSelect={handleSecondaryTreeSelect}
                          onRuneSelect={handleRuneSelect}
                        />

                        {/* Shards */}
                        <ShardSelector
                          statPerks={statPerks}
                          selectedShards={selectedShards}
                          onShardSelect={handleShardSelect}
                          locale={locale}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Items Selector */}
              <ItemsSelector
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onItemRemove={handleItemRemove}
              />
            </div>
          </div>
        </div>

        {/* Save Build Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => handleSaveBuild()}
            disabled={!isBuildComplete()}
            className={`px-8 py-2 ${
              isBuildComplete()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Save Build
          </Button>
          {!isBuildComplete() && (
            <p className="text-sm text-gray-500 mt-2">
              Select game mode, champion, all required runes, shards, and items
              to enable save
            </p>
          )}
        </div>

        {/* Champion Selector Modal */}
        <ChampionSelectorModal
          showChampionSelector={showChampionSelector}
          champions={champions}
          championsLoading={championsLoading}
          onChampionSelect={handleChampionSelect}
          onClose={() => setShowChampionSelector(false)}
        />

        {/* Save Build Modal */}
        <SaveBuildModal
          isOpen={showSaveModal}
          buildData={{
            champion: selectedChampion,
            gameMode: selectedMode,
            primaryTree: selectedTree,
            secondaryTree: selectedSecondaryTree,
            selectedRunes: selectedRunes,
            selectedShards: selectedShards,
            selectedItems: selectedItems,
          }}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveModal(false)}
          isSaving={isSaving}
        />
      </div>
    </TooltipProvider>
  );
}
