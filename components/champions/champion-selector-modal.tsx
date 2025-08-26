import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Search, X, AlertCircle } from "lucide-react";
import { useRuneBuildsByMode } from "@/hooks/useRuneBuilds";
import type { Champion } from "@/types";

interface ChampionSelectorModalProps {
  showChampionSelector: boolean;
  champions: Champion[];
  championsLoading: boolean;
  onChampionSelect: (champion: Champion) => void;
  onClose: () => void;
  selectedMode?: string | null; // Add selected mode prop
}

export function ChampionSelectorModal({
  showChampionSelector,
  champions,
  championsLoading,
  onChampionSelect,
  onClose,
  selectedMode,
}: ChampionSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch existing builds for the selected mode
  const { buildsByMode, isLoading: buildsLoading } = useRuneBuildsByMode(
    selectedMode || null
  );

  // Get champion keys that already have builds for this mode
  const existingChampionKeys = buildsByMode
    .map((build) => build.championKey)
    .filter(Boolean);

  // Check if a champion is disabled (already has a build for this mode)
  const isChampionDisabled = (champion: Champion) => {
    if (!selectedMode) return false;
    // Use champion.id as string since that's what we store in the database
    return existingChampionKeys.includes(champion.id.toString());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!showChampionSelector) return null;

  // Filter champions based on search query
  const filteredChampions =
    champions?.filter(
      (champion: Champion) =>
        champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold">Select Champion</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode-specific information */}
        {selectedMode && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex-shrink-0">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Mode: {selectedMode.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Champions with existing {selectedMode} builds are disabled to
              prevent duplicates.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search champions by name, title, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Champions Grid - Scrollable Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {championsLoading || buildsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading champions...</p>
            </div>
          ) : (
            <div className="overflow-y-auto">
              {filteredChampions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery
                      ? `No champions found for "${searchQuery}"`
                      : "No champions available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredChampions.map((champion: Champion) => {
                    const isDisabled = isChampionDisabled(champion);
                    return (
                      <div
                        key={champion.id}
                        className={`text-center p-3 border rounded-lg transition-colors ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        }`}
                        onClick={() =>
                          !isDisabled && onChampionSelect(champion)
                        }
                      >
                        <div className="w-16 h-16 mx-auto mb-2 relative rounded-lg overflow-hidden">
                          <Image
                            src={champion.image}
                            alt={champion.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                          {isDisabled && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                              <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <p
                          className={`text-sm font-medium truncate ${
                            isDisabled ? "text-gray-500" : ""
                          }`}
                        >
                          {champion.name}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDisabled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {champion.title}
                        </p>
                        {isDisabled && (
                          <p className="text-xs text-red-500 mt-1">
                            Already has {selectedMode} build
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Results Count */}
        {!championsLoading && searchQuery && (
          <div className="mt-4 text-center text-sm text-gray-500 flex-shrink-0">
            Found {filteredChampions.length} champion
            {filteredChampions.length !== 1 ? "s" : ""} for "{searchQuery}"
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side - Statistics */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="font-medium">Total Champions:</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                  {champions?.length || 0}
                </span>
              </div>
              {selectedMode && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Available:</span>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">
                    {
                      filteredChampions.filter(
                        (champ: Champion) => !isChampionDisabled(champ)
                      ).length
                    }
                  </span>
                </div>
              )}
              {selectedMode && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Disabled:</span>
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs">
                    {
                      filteredChampions.filter((champ: Champion) =>
                        isChampionDisabled(champ)
                      ).length
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              {selectedMode && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <p>💡 Tip: Select a different mode to see more champions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
