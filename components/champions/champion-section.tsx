import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Plus } from "lucide-react";

import type { Champion } from "@/types";

interface ChampionSectionProps {
  selectedChampion: Champion | null;
  onShowChampionSelector: () => void;
}

export function ChampionSection({
  selectedChampion,
  onShowChampionSelector,
}: ChampionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Champion</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedChampion ? (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative rounded-lg overflow-hidden">
              <Image
                src={selectedChampion.image}
                alt={selectedChampion.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedChampion.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedChampion.title}
            </p>
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {selectedChampion.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={onShowChampionSelector}
              className="w-full"
            >
              Change Champion
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div
              className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={onShowChampionSelector}
            >
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No champion selected</p>
            <Button onClick={onShowChampionSelector}>Select Champion</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
