import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { GameMode } from "@/types";

interface ModeSelectorProps {
  selectedMode: GameMode | null;
  onModeSelect: (mode: GameMode) => void;
}

export const GAME_MODES: GameMode[] = [
  {
    id: "urf",
    name: "URF",
    description: "Ultra Rapid Fire",
    icon: "⚡",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Summoner's Rift - 5v5",
    icon: "🏆",
  },
  {
    id: "aram",
    name: "ARAM",
    description: "All Random All Mid",
    icon: "⚔️",
  },
  {
    id: "nexus-blitz",
    name: "Nexus Blitz",
    description: "Fast-paced 5v5",
    icon: "🚀",
  },
];

export function ModeSelector({
  selectedMode,
  onModeSelect,
}: ModeSelectorProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Game Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {GAME_MODES.map((mode) => (
              <Tooltip key={mode.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                      selectedMode?.id === mode.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => onModeSelect(mode)}
                  >
                    <div className="text-center">
                      <h3 className="font-medium text-sm">{mode.name}</h3>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{mode.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
