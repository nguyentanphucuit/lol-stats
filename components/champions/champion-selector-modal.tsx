import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Search, X } from "lucide-react";

import type { Champion } from "./champion-section";

interface ChampionSelectorModalProps {
  showChampionSelector: boolean;
  champions: any;
  championsLoading: boolean;
  onChampionSelect: (champion: Champion) => void;
  onClose: () => void;
}

export function ChampionSelectorModal({
  showChampionSelector,
  champions,
  championsLoading,
  onChampionSelect,
  onClose,
}: ChampionSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!showChampionSelector) return null;

  // Filter champions based on search query
  const filteredChampions =
    champions?.champions?.filter(
      (champion: Champion) =>
        champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Select Champion</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
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

        {championsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading champions...</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
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
                {filteredChampions.map((champion: Champion) => (
                  <div
                    key={champion.id}
                    className="text-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => onChampionSelect(champion)}
                  >
                    <div className="w-16 h-16 mx-auto mb-2 relative rounded-lg overflow-hidden">
                      <Image
                        src={champion.image}
                        alt={champion.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">
                      {champion.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {champion.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Results Count */}
        {!championsLoading && searchQuery && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Found {filteredChampions.length} champion
            {filteredChampions.length !== 1 ? "s" : ""} for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
