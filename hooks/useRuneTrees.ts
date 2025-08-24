import { useQuery } from '@tanstack/react-query'
import { runesService } from '@/lib/runes-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'
import { RuneTree } from '@/types'

export function useRuneTrees() {
  const { locale } = useLocale()

  const runeTreesQuery = useQuery<RuneTree[]>({
    queryKey: ['rune-trees', locale],
    queryFn: async () => {
      return runesService.getRuneTrees(locale)
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep runes data in cache longer
  })

  return {
    runeTrees: runeTreesQuery.data,
    isLoading: runeTreesQuery.isLoading,
    error: runeTreesQuery.error,
    refetch: runeTreesQuery.refetch,
  }
}
