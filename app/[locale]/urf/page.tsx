"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { getLocaleCode } from "@/lib/locale-utils";
import { getTranslations } from "@/lib/translations";
import { useUrfBuilds } from "@/hooks/useUrfBuilds";
import { RuneBuildSection } from "@/components/runes/rune-build-section";
import { useRuneTrees } from "@/hooks/useRuneTrees";
import { useStatPerks } from "@/hooks/useStatPerks";
import { useSpells } from "@/hooks/useSpells";
import { TooltipProvider } from "@/components/ui/tooltip";
import Image from "next/image";
import { championService } from "@/lib/champion-service";
import { SpellDisplay } from "@/components/spells/spell-display";
import { ItemsDisplay } from "@/components/items/items-display";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UrfPage() {
  const { locale } = useLocale();
  const currentLocaleCode = getLocaleCode(locale);
  const translations = getTranslations(locale);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch URF builds data
  const { urfBuilds, isLoading, error } = useUrfBuilds();

  // Filter builds based on search query
  const filteredBuilds = urfBuilds.filter(
    (build) =>
      build.championName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      build.championKey?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch required data for RuneBuildSection
  const { runeTrees, isLoading: runeTreesLoading } = useRuneTrees();
  const { statPerks, isLoading: statPerksLoading } = useStatPerks({
    page: 1,
    limit: 100,
  });
  const { spells, isLoading: spellsLoading } = useSpells({
    page: 1,
    limit: 100,
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Search Input */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🔍 Search Champions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find your favorite champion builds quickly
                  </p>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Type champion name (e.g., Aatrox, Yasuo)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-center text-lg py-3 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      ✕ Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display URF builds */}
          <div className="space-y-8">
            {filteredBuilds.map((build, index) => (
              <Card key={`urf-build-${index}`} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={championService.getChampionImageUrlByKey(
                            build.championKey || "unknown"
                          )}
                          alt={build.championName || "Champion"}
                          width={80}
                          height={80}
                          className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                        <Badge
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 uppercase font-bold text-xs px-2 py-1"
                        >
                          {build.gameMode}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {build.championName || "Unknown Champion"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          URF Build #{index + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Spells Display */}
                      <SpellDisplay spells={build.selectedSpells || []} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Runes Section */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Rune Build
                      </h4>
                      <RuneBuildSection
                        runeTrees={runeTrees || []}
                        selectedTree={
                          runeTrees?.find(
                            (tree) => tree.id === build?.primaryTreeId
                          ) || null
                        }
                        selectedSecondaryTree={
                          runeTrees?.find(
                            (tree) => tree.id === build?.secondaryTreeId
                          ) || null
                        }
                        selectedRunes={
                          filteredBuilds?.[index]
                            ? [
                                ...(build.primaryRunes || []),
                                ...(build.secondaryRunes || []),
                              ]
                            : []
                        }
                        selectedShards={filteredBuilds[index]?.statShards || []}
                        runeTreesLoading={runeTreesLoading}
                        statPerksLoading={statPerksLoading}
                        spellsLoading={spellsLoading}
                        enabled={false}
                        onTreeSelect={() => {}}
                        onSecondaryTreeSelect={() => {}}
                        onRuneSelect={() => {}}
                        onShardSelect={() => {}}
                        locale={locale}
                      />
                    </div>

                    {/* Items Section */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Item Builds
                      </h4>
                      <ItemsDisplay
                        items={build.selectedItems1 || []}
                        title="Item Build 1"
                      />
                      {build.selectedItems2 &&
                        build.selectedItems2.length > 0 && (
                          <ItemsDisplay
                            items={build.selectedItems2 || []}
                            title="Item Build 2"
                          />
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show message if no URF builds or no search results */}
          {!isLoading && !error && (
            <>
              {urfBuilds.length === 0 && (
                <Card className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      No URF Builds Yet
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      Be the first to create an URF champion build!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Head to the Rune Builder to create your first URF build
                    </p>
                  </CardContent>
                </Card>
              )}
              {urfBuilds.length > 0 &&
                filteredBuilds.length === 0 &&
                searchQuery && (
                  <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-0 shadow-lg">
                    <CardContent className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        No Champions Found
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        No champions match "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Try a different search term or check your spelling
                      </p>
                    </CardContent>
                  </Card>
                )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
