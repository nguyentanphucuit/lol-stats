import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { X, Check, Save } from "lucide-react";
import { runesService } from "@/lib/runes-service";
import type { GameMode } from "@/components/game-modes/mode-selector";
import type { Champion } from "@/components/champions/champion-section";
import type { RuneTree, SelectedRune, SelectedShard } from "./types";
import type { SelectedItem } from "@/components/items/items-selector";
import type { SelectedSpell } from "@/components/spells/spells-selector";

interface SaveBuildModalProps {
  isOpen: boolean;
  buildData: {
    champion: Champion | null;
    gameMode: GameMode | null;
    primaryTree: RuneTree | null;
    secondaryTree: RuneTree | null;
    selectedRunes: SelectedRune[];
    selectedShards: SelectedShard[];
    selectedItems1: SelectedItem[];
    selectedItems2: SelectedItem[];
    selectedSpells: SelectedSpell[];
  };
  onConfirm: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function SaveBuildModal({
  isOpen,
  buildData,
  onConfirm,
  onCancel,
  isSaving = false,
}: SaveBuildModalProps) {
  if (!isOpen) return null;

  const {
    champion,
    gameMode,
    primaryTree,
    secondaryTree,
    selectedRunes,
    selectedShards,
    selectedItems1,
    selectedItems2,
    selectedSpells,
  } = buildData;

  const primaryRunes = selectedRunes.filter(
    (r) => r.style === primaryTree?.name
  );
  const secondaryRunes = selectedRunes.filter(
    (r) => r.style === secondaryTree?.name
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold">Review Rune Build</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              {/* Champion */}
              {champion && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={champion.image}
                          alt={champion.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{champion.name}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {champion.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {champion.tags?.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={`tag-${tag}-${index}`}
                              variant="secondary"
                              className="text-xs px-1.5 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {champion.tags && champion.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0.5"
                            >
                              +{champion.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Game Mode */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{gameMode?.icon}</span>
                    <div>
                      <h3 className="font-medium text-sm">{gameMode?.name}</h3>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {gameMode?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summoner Spells */}
              {selectedSpells.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSpells
                        .sort((a, b) => a.slotIndex - b.slotIndex)
                        .map((spell, index) => (
                          <div
                            key={`spell-${spell.id || spell.slotIndex || index}`}
                            className="flex items-center gap-2 p-1.5 border rounded"
                          >
                            <Image
                              src={spell.icon}
                              alt={spell.name}
                              width={24}
                              height={24}
                              className="rounded object-cover"
                              onError={(e) => {
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${spell.name.charAt(0)}</span>`;
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {spell.name}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Runes and Shards */}
            <div className="space-y-4">
              {/* Primary Tree */}
              {primaryTree && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {primaryRunes.map((rune, index) => (
                        <div
                          key={`rune-${rune.id || index}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={runesService.getRuneImageUrl(rune.icon)}
                            alt={rune.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                          <span className="text-xs flex-1">{rune.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            Slot {rune.slotNumber}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Secondary Tree */}
              {secondaryTree && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {secondaryRunes.map((rune, index) => (
                        <div
                          key={`rune-${rune.id || index}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={runesService.getRuneImageUrl(rune.icon)}
                            alt={rune.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                          <span className="text-xs flex-1">{rune.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            Slot {rune.slotNumber}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stat Shards */}
              {selectedShards.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {selectedShards.map((shard, index) => (
                        <div
                          key={`shard-${shard.id || index}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={shard.icon}
                            alt={shard.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                          <span className="text-xs flex-1">{shard.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {shard.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Items Display */}
          {selectedItems1.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedItems1
                    .sort((a, b) => a.slotIndex - b.slotIndex)
                    .map((item, index) => (
                      <div
                        key={`item-${item.id || item.slotIndex || index}`}
                        className="flex items-center gap-2 p-1.5 border rounded"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                          className="rounded object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${item.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.gold.toLocaleString()} gold
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items Build 2 Display */}
          {selectedItems2.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedItems2
                    .sort((a, b) => a.slotIndex - b.slotIndex)
                    .map((item, index) => (
                      <div
                        key={`item2-${item.id || item.slotIndex || index}`}
                        className="flex items-center gap-2 p-1.5 border rounded"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                          className="rounded object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${item.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.gold.toLocaleString()} gold
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="flex gap-3 justify-end p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Build
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
