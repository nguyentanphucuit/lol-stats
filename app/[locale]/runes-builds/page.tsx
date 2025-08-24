"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/locale-provider";
import { getLocaleCode } from "@/lib/locale-utils";
import { getTranslations } from "@/lib/translations";
import { useRuneBuilds } from "@/hooks/useRuneBuilds";
import Link from "next/link";
import { Plus, Trash2, Eye, Filter, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { runesService } from "@/lib/runes-service";
import { LEAGUE_CONFIG } from "@/lib/league-config";
import { useState, useMemo } from "react";

export default function RunesBuildsPage() {
  const { locale } = useLocale();
  const currentLocaleCode = getLocaleCode(locale);
  const translations = getTranslations(locale);
  const { runeBuilds, isLoading, error } = useRuneBuilds();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChampions, setSelectedChampions] = useState<string[]>([]);
  const [selectedGameModes, setSelectedGameModes] = useState<string[]>([]);

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    if (!runeBuilds) {
      return { champions: [], gameModes: [] };
    }

    const champions = [
      ...new Set(
        runeBuilds
          .map((build) => build.championName)
          .filter((name): name is string => Boolean(name))
      ),
    ];
    const gameModes = [...new Set(runeBuilds.map((build) => build.gameMode))];

    return { champions, gameModes };
  }, [runeBuilds]);

  // Filtered builds
  const filteredBuilds = useMemo(() => {
    if (!runeBuilds) return [];

    return runeBuilds.filter((build) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          build.championName?.toLowerCase().includes(searchLower) ||
          build.gameMode.toLowerCase().includes(searchLower) ||
          build.primaryTreeName.toLowerCase().includes(searchLower) ||
          build.secondaryTreeName.toLowerCase().includes(searchLower) ||
          build.primaryRunes.some((rune) =>
            rune.name?.toLowerCase().includes(searchLower)
          ) ||
          build.secondaryRunes.some((rune) =>
            rune.name?.toLowerCase().includes(searchLower)
          ) ||
          build.statShards.some((shard) =>
            shard.name?.toLowerCase().includes(searchLower)
          ) ||
          build.selectedItems?.some((item) =>
            item.name?.toLowerCase().includes(searchLower)
          ) ||
          build.selectedSpells?.some((spell) =>
            spell.name?.toLowerCase().includes(searchLower)
          );

        if (!matchesSearch) return false;
      }

      // Champion filter
      if (selectedChampions.length > 0) {
        if (
          !build.championName ||
          !selectedChampions.includes(build.championName)
        ) {
          return false;
        }
      }

      // Game mode filter
      if (selectedGameModes.length > 0) {
        if (!selectedGameModes.includes(build.gameMode)) {
          return false;
        }
      }

      return true;
    });
  }, [runeBuilds, searchTerm, selectedChampions, selectedGameModes]);

  // Filter toggle functions
  const toggleChampion = (champion: string) => {
    setSelectedChampions((prev) =>
      prev.includes(champion)
        ? prev.filter((c) => c !== champion)
        : [...prev, champion]
    );
  };

  const toggleGameMode = (gameMode: string) => {
    setSelectedGameModes((prev) =>
      prev.includes(gameMode)
        ? prev.filter((g) => g !== gameMode)
        : [...prev, gameMode]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedChampions([]);
    setSelectedGameModes([]);
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm || selectedChampions.length > 0 || selectedGameModes.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-4 bg-gray-300 rounded w-full"
                    ></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">
                Failed to load rune builds: {error}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    Rune Builds
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    View and manage your saved rune builds
                  </p>
                </div>
                <Link href={`/${currentLocaleCode}/runes-builds/build`}>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Build
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search builds, champions, runes, or game modes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap gap-3">
                  {/* Champion Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Champions ({selectedChampions.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Filter by Champion</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {uniqueValues.champions.map((champion) => (
                        <DropdownMenuCheckboxItem
                          key={champion}
                          checked={selectedChampions.includes(champion)}
                          onCheckedChange={() => toggleChampion(champion)}
                        >
                          {champion}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Game Mode Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Game Modes ({selectedGameModes.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Filter by Game Mode</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {uniqueValues.gameModes.map((gameMode) => (
                        <DropdownMenuCheckboxItem
                          key={gameMode}
                          checked={selectedGameModes.includes(gameMode)}
                          onCheckedChange={() => toggleGameMode(gameMode)}
                        >
                          {gameMode}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Active filters:
                    </span>
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedChampions.map((champion) => (
                      <Badge
                        key={champion}
                        variant="secondary"
                        className="gap-1"
                      >
                        Champion: {champion}
                        <button
                          onClick={() => toggleChampion(champion)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedGameModes.map((gameMode) => (
                      <Badge
                        key={gameMode}
                        variant="secondary"
                        className="gap-1"
                      >
                        Mode: {gameMode}
                        <button
                          onClick={() => toggleGameMode(gameMode)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rune Builds Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Saved Rune Builds</CardTitle>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredBuilds.length} of {runeBuilds.length} builds
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBuilds.length === 0 ? (
                <div className="text-center py-12">
                  {hasActiveFilters ? (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                        No builds match your current filters
                      </p>
                      <Button variant="outline" onClick={clearAllFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                        No rune builds found
                      </p>
                      <Link href={`/${currentLocaleCode}/runes-builds/build`}>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Build
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Champion</TableHead>
                        <TableHead>Game Mode</TableHead>
                        <TableHead>Primary Runes</TableHead>
                        <TableHead>Secondary Runes</TableHead>
                        <TableHead>Stat Shards</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Spells</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBuilds.map((build) => (
                        <TableRow key={build.id}>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Image
                                  src={`${LEAGUE_CONFIG.CHAMPION_IMAGE_URL}/${build.championKey || "unknown"}.png`}
                                  alt={build.secondaryTreeName || "Champion"}
                                  width={32}
                                  height={32}
                                  className="rounded object-cover"
                                  onError={(e) => {
                                    const target =
                                      e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(build.secondaryTreeName || "C").charAt(0)}</span>`;
                                    }
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-sm">
                                <p className="font-bold text-blue-600 dark:text-blue-400">
                                  {build.championName}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 rounded-md uppercase"
                            >
                              {build.gameMode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {build.primaryRunes.map((rune, index) => (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <div className="w-8 h-8 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                      {rune.icon ? (
                                        <Image
                                          src={runesService.getRuneImageUrl(
                                            rune.icon
                                          )}
                                          alt={rune.name || `Rune ${index + 1}`}
                                          width={32}
                                          height={32}
                                          className="rounded object-cover"
                                          onError={(e) => {
                                            const target =
                                              e.currentTarget as HTMLImageElement;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(rune.name || `R${index + 1}`).charAt(0)}</span>`;
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                          {rune.name
                                            ? rune.name.charAt(0)
                                            : `R${index + 1}`}
                                        </span>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-sm"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        {rune.icon && (
                                          <div className="w-5 h-5 relative">
                                            <Image
                                              src={runesService.getRuneImageUrl(
                                                rune.icon
                                              )}
                                              alt={
                                                rune.name || `Rune ${index + 1}`
                                              }
                                              width={20}
                                              height={20}
                                              className="rounded object-cover"
                                            />
                                          </div>
                                        )}
                                        <p className="font-bold text-blue-600 dark:text-blue-400">
                                          {rune.name || `Rune ${index + 1}`}
                                        </p>
                                      </div>
                                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          Slot {rune.slotNumber || index + 1}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Style: {rune.style || "Unknown"}
                                        </p>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {build.secondaryRunes.map((rune, index) => (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <div className="w-8 h-8 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                      {rune.icon ? (
                                        <Image
                                          src={runesService.getRuneImageUrl(
                                            rune.icon
                                          )}
                                          alt={rune.name || `Rune ${index + 1}`}
                                          width={32}
                                          height={32}
                                          className="rounded object-cover"
                                          onError={(e) => {
                                            const target =
                                              e.currentTarget as HTMLImageElement;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(rune.name || `R${index + 1}`).charAt(0)}</span>`;
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                          {rune.name
                                            ? rune.name.charAt(0)
                                            : `R${index + 1}`}
                                        </span>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-sm"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        {rune.icon && (
                                          <div className="w-5 h-5 relative">
                                            <Image
                                              src={runesService.getRuneImageUrl(
                                                rune.icon
                                              )}
                                              alt={
                                                rune.name || `Rune ${index + 1}`
                                              }
                                              width={20}
                                              height={20}
                                              className="rounded object-cover"
                                            />
                                          </div>
                                        )}
                                        <p className="font-bold text-blue-600 dark:text-blue-400">
                                          {rune.name || `Rune ${index + 1}`}
                                        </p>
                                      </div>
                                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          Slot {rune.slotNumber || index + 1}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Style: {rune.style || "Unknown"}
                                        </p>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {build.statShards.map((shard, index) => (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <div className="w-8 h-8 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                      {shard.icon ? (
                                        <Image
                                          src={shard.icon}
                                          alt={
                                            shard.name || `Shard ${index + 1}`
                                          }
                                          width={32}
                                          height={32}
                                          className="rounded object-cover"
                                          onError={(e) => {
                                            const target =
                                              e.currentTarget as HTMLImageElement;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(shard.name || `S${index + 1}`).charAt(0)}</span>`;
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                          {shard.name
                                            ? shard.name.charAt(0)
                                            : `S${index + 1}`}
                                        </span>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-sm"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        {shard.icon && (
                                          <div className="w-5 h-5 relative">
                                            <Image
                                              src={shard.icon}
                                              alt={
                                                shard.name ||
                                                `Shard ${index + 1}`
                                              }
                                              width={20}
                                              height={20}
                                              className="rounded object-cover"
                                            />
                                          </div>
                                        )}
                                        <p className="font-bold text-blue-600 dark:text-blue-400">
                                          {shard.name || `Shard ${index + 1}`}
                                        </p>
                                      </div>
                                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          Category:{" "}
                                          {shard.category || "Unknown"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Slot:{" "}
                                          {shard.slotIndex !== undefined
                                            ? shard.slotIndex + 1
                                            : index + 1}
                                        </p>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {build.selectedItems &&
                              build.selectedItems.length > 0 ? (
                                build.selectedItems.map((item, index) => (
                                  <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                      <div className="w-8 h-8 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                        {item.icon ? (
                                          <Image
                                            src={item.icon}
                                            alt={
                                              item.name || `Item ${index + 1}`
                                            }
                                            width={32}
                                            height={32}
                                            className="rounded object-cover"
                                            onError={(e) => {
                                              const target =
                                                e.currentTarget as HTMLImageElement;
                                              target.style.display = "none";
                                              const parent =
                                                target.parentElement;
                                              if (parent) {
                                                parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(item.name || `I${index + 1}`).charAt(0)}</span>`;
                                              }
                                            }}
                                          />
                                        ) : (
                                          <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                            {item.name
                                              ? item.name.charAt(0)
                                              : `I${index + 1}`}
                                          </span>
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="max-w-sm"
                                    >
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          {item.icon && (
                                            <div className="w-5 h-5 relative">
                                              <Image
                                                src={item.icon}
                                                alt={
                                                  item.name ||
                                                  `Item ${index + 1}`
                                                }
                                                width={20}
                                                height={20}
                                                className="rounded object-cover"
                                              />
                                            </div>
                                          )}
                                          <p className="font-bold text-blue-600 dark:text-blue-400">
                                            {item.name || `Item ${index + 1}`}
                                          </p>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                          <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Slot:{" "}
                                            {item.slotIndex !== undefined
                                              ? item.slotIndex + 1
                                              : index + 1}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {item.gold
                                              ? `${item.gold.toLocaleString()} gold`
                                              : "Unknown gold cost"}
                                          </p>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No items
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {build.selectedSpells &&
                              build.selectedSpells.length > 0 ? (
                                build.selectedSpells.map((spell, index) => (
                                  <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                      <div className="w-8 h-8 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                        {spell.icon ? (
                                          <Image
                                            src={spell.icon}
                                            alt={
                                              spell.name || `Spell ${index + 1}`
                                            }
                                            width={32}
                                            height={32}
                                            className="rounded object-cover"
                                            onError={(e) => {
                                              const target =
                                                e.currentTarget as HTMLImageElement;
                                              target.style.display = "none";
                                              const parent =
                                                target.parentElement;
                                              if (parent) {
                                                parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${(spell.name || `S${index + 1}`).charAt(0)}</span>`;
                                              }
                                            }}
                                          />
                                        ) : (
                                          <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                                            {spell.name
                                              ? spell.name.charAt(0)
                                              : `S${index + 1}`}
                                          </span>
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="max-w-sm"
                                    >
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          {spell.icon && (
                                            <div className="w-5 h-5 relative">
                                              <Image
                                                src={spell.icon}
                                                alt={
                                                  spell.name ||
                                                  `Spell ${index + 1}`
                                                }
                                                width={20}
                                                height={20}
                                                className="rounded object-cover"
                                              />
                                            </div>
                                          )}
                                          <p className="font-bold text-blue-600 dark:text-blue-400">
                                            {spell.name || `Spell ${index + 1}`}
                                          </p>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                          <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Slot:{" "}
                                            {spell.slotIndex !== undefined
                                              ? spell.slotIndex + 1
                                              : index + 1}
                                          </p>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No spells
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(build.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {filteredBuilds.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredBuilds.length} of {runeBuilds.length} rune
                build
                {runeBuilds.length !== 1 ? "s" : ""}
                {hasActiveFilters && " (filtered)"}
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
