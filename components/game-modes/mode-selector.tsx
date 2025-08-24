import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive?: boolean;
}

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
    <Card>
      <CardHeader>
        <CardTitle>Game Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {GAME_MODES.map((mode) => (
            <div
              key={mode.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                selectedMode?.id === mode.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => onModeSelect(mode)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{mode.icon}</div>
                <h3 className="font-medium text-sm mb-1">{mode.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
