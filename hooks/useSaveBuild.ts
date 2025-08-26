import { useMutation } from '@tanstack/react-query';

interface SaveBuildData {
  championKey: string | undefined;
  championName: string | undefined;
  gameMode: string;
  primaryTreeId: string;
  primaryTreeName: string;
  secondaryTreeId: string;
  secondaryTreeName: string;
  primaryRunes: Array<{
    id: string;
    name: string;
    icon: string;
    slotNumber: number;
    style: string;
  }>;
  secondaryRunes: Array<{
    id: string;
    name: string;
    icon: string;
    slotNumber: number;
    style: string;
  }>;
  statShards: Array<{
    id: string;
    name: string;
    icon: string;
    slotIndex: number;
    category: string;
  }>;
  selectedItems1: Array<{
    id: string;
    name: string;
    icon: string;
    gold: number;
    slotIndex: number;
  }>;
  selectedItems2: Array<{
    id: string;
    name: string;
    icon: string;
    gold: number;
    slotIndex: number;
  }>;
  selectedSpells: Array<{
    id: string;
    name: string;
    icon: string;
    slotIndex: number;
  }>;
}

export function useSaveBuild() {
  return useMutation({
    mutationFn: async (buildData: SaveBuildData) => {
      const response = await fetch('/api/rune-builds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  });
}
