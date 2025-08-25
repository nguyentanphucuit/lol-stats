"use client";

import type { Champion } from "@/components/champions/champion-section";
import { ChampionSection } from "@/components/champions/champion-section";
import { ChampionSelectorModal } from "@/components/champions/champion-selector-modal";
import type { GameMode } from "@/components/game-modes/mode-selector";
import {
  GAME_MODES,
  ModeSelector,
} from "@/components/game-modes/mode-selector";
import { ItemsSelector, SelectedItem } from "@/components/items/items-selector";
import { useLocale } from "@/components/providers/locale-provider";
import { RuneBuildSection } from "@/components/runes/rune-build-section";
import { SaveBuildModal } from "@/components/runes/save-build-modal";
import {
  RuneTree,
  SelectedRune,
  SelectedShard,
} from "@/components/runes/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { useChampions } from "@/hooks/useChampions";
import { useRuneTrees } from "@/hooks/useRuneTrees";
import { useSpells } from "@/hooks/useSpells";
import { useStatPerks } from "@/hooks/useStatPerks";
import { useMaps } from "@/hooks/useMaps";
import { getLocaleCode } from "@/lib/locale-utils";
import { spellsService } from "@/lib/spells-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpellsSelector } from "../../../../components/spells/spells-selector";

export default function RuneBuilderPage() {
  const { locale } = useLocale();
  const currentLocaleCode = getLocaleCode(locale);
  const { showToast, ToastContainer } = useToast();

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
  const [selectedItems2, setSelectedItems2] = useState<SelectedItem[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<any[]>([]);
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

  const { spells, isLoading: spellsLoading } = useSpells({
    page: 1,
    limit: 200,
    q: "",
  });

  const { maps, isLoading: mapsLoading } = useMaps();

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

  // Function to clear all form data
  const clearFormData = () => {
    setSelectedChampion(null);
    setSelectedRunes([]);
    setSelectedShards([]);
    setSelectedItems([]);
    setSelectedItems2([]);
    setSelectedSpells([]);
    // Reset to first available trees
    if (runeTrees && runeTrees.length > 0) {
      setSelectedTree(runeTrees[0]);
      if (runeTrees.length > 1) {
        setSelectedSecondaryTree(runeTrees[1]);
      }
    }
    // Reset to first game mode
    setSelectedMode(GAME_MODES[0]);
  };

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

  const handleItemSelect2 = (item: any, slotIndex: number) => {
    const newItem: SelectedItem = {
      id: item.id,
      name: item.name,
      icon: item.image, // Use the full image URL from API
      gold: item.gold.total,
      slotIndex,
    };

    setSelectedItems2((prev) => {
      const filtered = prev.filter((i) => i.slotIndex !== slotIndex);
      return [...filtered, newItem];
    });
  };

  const handleItemRemove2 = (slotIndex: number) => {
    setSelectedItems2((prev) =>
      prev.filter((item) => item.slotIndex !== slotIndex)
    );
  };

  const handleSpellSelect = (spell: any, slotIndex: number) => {
    const newSpell: any = {
      id: spell.id,
      name: spell.name,
      icon: spellsService.getSpellImageUrl(spell.image.full), // Use spellsService to get proper image URL
      slotIndex,
    };

    setSelectedSpells((prev) => {
      const filtered = prev.filter((s) => s.slotIndex !== slotIndex);
      return [...filtered, newSpell];
    });
  };

  const handleSpellRemove = (slotIndex: number) => {
    setSelectedSpells((prev) =>
      prev.filter((spell) => spell.slotIndex !== slotIndex)
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
      selectedItems.length < 6 ||
      selectedSpells.length < 1
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

    // Check if we have all 6 items in Item Build 1 (required)
    if (selectedItems.length < 6) {
      return false;
    }

    // Item Build 2 validation: if started (has items), must have 6 items
    if (selectedItems2.length > 0 && selectedItems2.length < 6) {
      return false;
    }

    // Check if we have exactly 2 spells
    if (selectedSpells.length < 2) {
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
        selectedItems1: selectedItems
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((item) => ({
            ...item,
            id: item.id?.toString() || String(item.id), // Safe conversion with fallback
          })),
        selectedItems2: selectedItems2
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((item) => ({
            ...item,
            id: item.id?.toString() || String(item.id), // Safe conversion with fallback
          })),
        selectedSpells: selectedSpells
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((spell) => ({
            ...spell,
            id: spell.id?.toString() || String(spell.id), // Safe conversion with fallback
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

      // Show success toast
      showToast("Rune build saved successfully! 🎉", "success");

      // Reset form and close modal
      setShowSaveModal(false);
      clearFormData();
    } catch (error) {
      console.error("Error saving rune build:", error);
      showToast(
        `Failed to save rune build: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
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
        {/* Toast Container */}
        <ToastContainer />

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
            <div className="flex flex-col lg:flex-row gap-6 mb-6 justify-center">
              <ChampionSection
                selectedChampion={selectedChampion}
                onShowChampionSelector={() => setShowChampionSelector(true)}
              />
              <div className="flex flex-col gap-4">
                <ModeSelector
                  selectedMode={selectedMode}
                  onModeSelect={handleModeSelect}
                />
                {/* Spells Selector */}
                <SpellsSelector
                  selectedSpells={selectedSpells}
                  onSpellSelect={handleSpellSelect}
                  onSpellRemove={handleSpellRemove}
                />
              </div>
              <RuneBuildSection
                runeTrees={runeTrees || []}
                selectedTree={selectedTree}
                selectedSecondaryTree={selectedSecondaryTree}
                selectedRunes={selectedRunes}
                selectedShards={selectedShards}
                runeTreesLoading={runeTreesLoading}
                statPerksLoading={statPerksLoading}
                spellsLoading={spellsLoading}
                enabled={true} // Enable selection in build mode
                onTreeSelect={handleTreeSelect}
                onSecondaryTreeSelect={handleSecondaryTreeSelect}
                onRuneSelect={handleRuneSelect}
                onShardSelect={handleShardSelect}
                locale={locale}
              />
              {/* Items Selector */}
              <ItemsSelector
                selectedItems1={selectedItems}
                selectedItems2={selectedItems2}
                onItemSelect1={handleItemSelect}
                onItemRemove1={handleItemRemove}
                onItemSelect2={handleItemSelect2}
                onItemRemove2={handleItemRemove2}
                maps={maps || []}
                mapsLoading={mapsLoading}
              />
            </div>
          </div>
        </div>

        {/* Save Build Button */}
        <div className="mt-6 text-center space-y-4">
          <div className="flex gap-4 justify-center">
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
            <Button
              onClick={clearFormData}
              variant="outline"
              className="px-8 py-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Clear Form
            </Button>
          </div>
          {!isBuildComplete() && (
            <p className="text-sm text-gray-500 mt-2">
              Select game mode, champion, all required runes, shards, Item Build
              1 (6 items), and spells to enable save. Item Build 2 is optional
              but must be completed if started.
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
            selectedItems1: selectedItems,
            selectedItems2: selectedItems2,
            selectedSpells: selectedSpells,
          }}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveModal(false)}
          isSaving={isSaving}
        />
      </div>
    </TooltipProvider>
  );
}
