import { useQuery } from '@tanstack/react-query';
import { championService } from '@/lib/champion-service';
import { runesService } from '@/lib/runes-service';
import { statPerksService } from '@/lib/stat-perks-service';
import { spellsService } from '@/lib/spells-service';
import { mapService } from '@/lib/map-service';

export function useChampionsQuery() {
  return useQuery({
    queryKey: ['champions'],
    queryFn: () => championService.getChampions({ page: 1, limit: 1000 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRuneTreesQuery() {
  return useQuery({
    queryKey: ['rune-trees'],
    queryFn: () => runesService.getRuneTrees(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useStatPerksQuery() {
  return useQuery({
    queryKey: ['stat-perks'],
    queryFn: () => statPerksService.getStatPerks({ page: 1, limit: 1000 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSpellsQuery() {
  return useQuery({
    queryKey: ['spells'],
    queryFn: () => spellsService.getSpells({ page: 1, limit: 200 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useItemsQuery(searchTerm?: string) {
  return useQuery({
    queryKey: ['items', searchTerm],
    queryFn: () => {
      // Import itemsService dynamically to avoid circular dependencies
      return import('@/lib/items-service').then(({ itemsService }) =>
        itemsService.getItems({ page: 1, limit: 1000, q: searchTerm })
      );
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMapsQuery() {
  return useQuery({
    queryKey: ['maps'],
    queryFn: () => mapService.getMaps(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
