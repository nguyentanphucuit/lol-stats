"use client";

import type { Champion } from "@/types";
import { ChampionSection } from "@/components/champions/champion-section";
import { ChampionSelectorModal } from "@/components/champions/champion-selector-modal";
import { GAME_MODES } from "@/components/game-modes/mode-selector";
import { ModeSelector } from "@/components/game-modes/mode-selector";
import { ItemsSelector } from "@/components/items/items-selector";
import { useLocale } from "@/components/providers/locale-provider";
import { RuneBuildSection } from "@/components/runes/rune-build-section";
import { SaveBuildModal } from "@/components/runes/save-build-modal";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import {
  useChampionsQuery,
  useRuneTreesQuery,
  useStatPerksQuery,
  useSpellsQuery,
  useMapsQuery,
} from "@/hooks/useBuildQueries";
import { useSaveBuild } from "@/hooks/useSaveBuild";
import { useBuildStore } from "@/lib/build-store";
import { validateBuild } from "@/lib/build-validation";
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

  // Zustand store
  const {
    champion,
    mode,
    primaryTree,
    secondaryTree,
    runes,
    shards,
    items1,
    items2,
    spells,
    setChampion,
    setMode,
    setPrimaryTree,
    setSecondaryTree,
    setRune,
    setShard,
    setItem,
    removeItem,
    setSpell,
    removeSpell,
    resetBuild,
  } = useBuildStore();

  // Local state
  const [showChampionSelector, setShowChampionSelector] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // TanStack Query hooks
  const {
    data: championsData,
    isLoading: championsLoading,
    error: championsError,
  } = useChampionsQuery();
  const {
    data: runeTreesData,
    isLoading: runeTreesLoading,
    error: runeTreesError,
  } = useRuneTreesQuery();
  const {
    data: statPerksData,
    isLoading: statPerksLoading,
    error: statPerksError,
  } = useStatPerksQuery();
  const {
    data: spellsData,
    isLoading: spellsLoading,
    error: spellsError,
  } = useSpellsQuery();
  const {
    data: mapsData,
    isLoading: mapsLoading,
    error: mapsError,
  } = useMapsQuery();

  // Save build mutation
  const { mutate: saveBuild, isPending: isSaving } = useSaveBuild();

  // Derived state
  const champions = championsData?.champions || [];
  const runeTrees = runeTreesData || [];
  const statPerks = statPerksData?.statPerks || [];
  const availableSpells = spellsData?.spells || [];
  const maps = mapsData || [];

  // Loading and error states
  const isLoading =
    championsLoading ||
    runeTreesLoading ||
    statPerksLoading ||
    spellsLoading ||
    mapsLoading;
  const error =
    championsError ||
    runeTreesError ||
    statPerksError ||
    spellsError ||
    mapsError;

  // Effects
  useEffect(() => {
    if (runeTrees && runeTrees.length > 0 && !primaryTree) {
      setPrimaryTree(runeTrees[0]);
    }
  }, [runeTrees, primaryTree, setPrimaryTree]);

  // Auto-select first game mode
  useEffect(() => {
    if (!mode) {
      setMode(GAME_MODES[0]);
    }
  }, [mode, setMode]);

  // Auto-select first available secondary tree when primary tree changes
  useEffect(() => {
    if (primaryTree && runeTrees && runeTrees.length > 0) {
      const availableSecondaryTrees = runeTrees.filter(
        (tree) => tree.id !== primaryTree.id
      );
      if (availableSecondaryTrees.length > 0 && !secondaryTree) {
        setSecondaryTree(availableSecondaryTrees[0]);
      }
    }
  }, [primaryTree, runeTrees, secondaryTree, setSecondaryTree]);

  // Event handlers
  const handleChampionSelect = (champion: Champion) => {
    setChampion(champion);
    setShowChampionSelector(false);
  };

  const handleTreeSelect = (tree: any) => {
    setPrimaryTree(tree);
  };

  const handleSecondaryTreeSelect = (tree: any) => {
    setSecondaryTree(tree);
  };

  const handleShardSelect = (shard: any, slotIndex: number) => {
    const newShard = {
      id: shard.id,
      name: shard.name,
      icon: shard.iconUrl,
      slotIndex,
      category: shard.category,
    };
    setShard(newShard);
  };

  const handleModeSelect = (mode: any) => {
    setMode(mode);
  };

  const handleItemSelect = (item: any, slotIndex: number) => {
    const newItem = {
      id: item.id,
      name: item.name,
      icon: item.image,
      gold: item.gold.total,
      slotIndex,
    };
    setItem(newItem, 1);
  };

  const handleItemRemove = (slotIndex: number) => {
    removeItem(slotIndex, 1);
  };

  const handleItemSelect2 = (item: any, slotIndex: number) => {
    const newItem = {
      id: item.id,
      name: item.name,
      icon: item.image,
      gold: item.gold.total,
      slotIndex,
    };
    setItem(newItem, 2);
  };

  const handleItemRemove2 = (slotIndex: number) => {
    removeItem(slotIndex, 2);
  };

  const handleSpellSelect = (spell: any, slotIndex: number) => {
    const newSpell = {
      id: spell.id,
      name: spell.name,
      icon: spellsService.getSpellImageUrl(spell.image.full),
      slotIndex,
    };
    setSpell(newSpell);
  };

  const handleSpellRemove = (slotIndex: number) => {
    removeSpell(slotIndex);
  };

  const handleRuneSelect = (rune: any, slotIndex: number, style: string) => {
    const newRune = {
      id: rune.id,
      name: rune.name,
      icon: rune.icon,
      slotNumber: slotIndex + 1,
      style,
    };
    setRune(newRune);
  };

  const handleSaveBuild = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!primaryTree || !secondaryTree || !mode) {
      showToast("Missing required build data", "error");
      return;
    }

    // Prepare data for API
    const primaryRunes = runes
      .filter((r) => r.style === primaryTree.name)
      .sort((a, b) => a.slotNumber - b.slotNumber)
      .map((rune) => ({
        ...rune,
        id: rune.id?.toString() || String(rune.id),
      }));

    const secondaryRunes = runes
      .filter((r) => r.style === secondaryTree.name)
      .sort((a, b) => a.slotNumber - b.slotNumber)
      .map((rune) => ({
        ...rune,
        id: rune.id?.toString() || String(rune.id),
      }));

    const buildData = {
      championKey: champion?.id?.toString(),
      championName: champion?.name,
      gameMode: mode.id,
      primaryTreeId: primaryTree.id.toString(),
      primaryTreeName: primaryTree.name,
      secondaryTreeId: secondaryTree.id.toString(),
      secondaryTreeName: secondaryTree.name,
      primaryRunes,
      secondaryRunes,
      statShards: shards
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map((shard) => ({
          ...shard,
          id: shard.id?.toString() || String(shard.id),
        })),
      selectedItems1: items1
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map((item) => ({
          ...item,
          id: item.id?.toString() || String(item.id),
        })),
      selectedItems2: items2
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map((item) => ({
          ...item,
          id: item.id?.toString() || String(item.id),
        })),
      selectedSpells: spells
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map((spell) => ({
          ...spell,
          id: spell.id?.toString() || String(spell.id),
        })),
    };

    saveBuild(buildData, {
      onSuccess: () => {
        showToast("Rune build saved successfully! 🎉", "success");
        setShowSaveModal(false);
        resetBuild();
      },
      onError: (error) => {
        console.error("Error saving rune build:", error);
        showToast(
          `Failed to save rune build: ${error instanceof Error ? error.message : "Unknown error"}`,
          "error"
        );
      },
    });
  };

  // Build validation
  const buildState = {
    champion,
    mode,
    primaryTree,
    secondaryTree,
    runes,
    shards,
    items1,
    items2,
    spells,
  };
  const isBuildComplete = validateBuild(buildState);

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

          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex items-center justify-center p-8 mb-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center p-8 mb-6">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">
                  Error loading data:{" "}
                  {error instanceof Error ? error.message : "Unknown error"}
                </p>
              </div>
            </div>
          )}

          {/* Right Column - Rune Selection */}
          {!isLoading && !error && (
            <div className="lg:col-span-2">
              <div className="flex flex-col lg:flex-row gap-6 mb-6 justify-center">
                <ChampionSection
                  selectedChampion={champion}
                  onShowChampionSelector={() => setShowChampionSelector(true)}
                />
                <div className="flex flex-col gap-4">
                  <ModeSelector
                    selectedMode={mode}
                    onModeSelect={handleModeSelect}
                  />
                  {/* Spells Selector */}
                  <SpellsSelector
                    selectedSpells={spells}
                    onSpellSelect={handleSpellSelect}
                    onSpellRemove={handleSpellRemove}
                  />
                </div>
                <RuneBuildSection
                  runeTrees={runeTrees}
                  selectedTree={primaryTree}
                  selectedSecondaryTree={secondaryTree}
                  selectedRunes={runes}
                  selectedShards={shards}
                  runeTreesLoading={runeTreesLoading}
                  statPerksLoading={statPerksLoading}
                  spellsLoading={spellsLoading}
                  enabled={true}
                  onTreeSelect={handleTreeSelect}
                  onSecondaryTreeSelect={handleSecondaryTreeSelect}
                  onRuneSelect={handleRuneSelect}
                  onShardSelect={handleShardSelect}
                  locale={locale}
                />
                {/* Items Selector */}
                <ItemsSelector
                  selectedItems1={items1}
                  selectedItems2={items2}
                  onItemSelect1={handleItemSelect}
                  onItemRemove1={handleItemRemove}
                  onItemSelect2={handleItemSelect2}
                  onItemRemove2={handleItemRemove2}
                  maps={maps}
                  mapsLoading={mapsLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Build Button */}
        {!isLoading && !error && (
          <div className="mt-6 text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleSaveBuild}
                disabled={!isBuildComplete}
                className={`px-8 py-2 ${
                  isBuildComplete
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Save Build
              </Button>
              <Button
                onClick={resetBuild}
                variant="outline"
                className="px-8 py-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Clear Form
              </Button>
            </div>
            {!isBuildComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Select game mode, champion, all required runes, shards, Item
                Build 1 (6 items), and spells to enable save. Item Build 2 is
                optional but must be completed if started.
              </p>
            )}
          </div>
        )}

        {/* Champion Selector Modal */}
        {!isLoading && !error && (
          <ChampionSelectorModal
            showChampionSelector={showChampionSelector}
            champions={champions}
            championsLoading={championsLoading}
            onChampionSelect={handleChampionSelect}
            onClose={() => setShowChampionSelector(false)}
            selectedMode={mode?.id || null}
          />
        )}

        {/* Save Build Modal */}
        {!isLoading && !error && (
          <SaveBuildModal
            isOpen={showSaveModal}
            buildData={{
              champion,
              gameMode: mode,
              primaryTree,
              secondaryTree,
              selectedRunes: runes,
              selectedShards: shards,
              selectedItems1: items1,
              selectedItems2: items2,
              selectedSpells: spells,
            }}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowSaveModal(false)}
            isSaving={isSaving}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
