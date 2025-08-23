import { useQuery } from '@tanstack/react-query'
import { spellsService } from '@/lib/spells-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'

interface UseSpellsParams {
  page: number
  limit: number
  q?: string
  modes?: string[]
}

export function useSpells(params: UseSpellsParams) {
  const { locale } = useLocale()
  
  const spellsQuery = useQuery({
    queryKey: ['spells', locale, params.q, params.modes, params.page],
    queryFn: async () => {
      return spellsService.getSpells({
        page: params.page,
        limit: params.limit,
        q: params.q,
        modes: params.modes,
        locale
      })
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep spells data in cache longer
  })

  const modesQuery = useQuery({
    queryKey: ['spell-modes', locale],
    queryFn: async (): Promise<string[]> => {
      return spellsService.getSpellModes(locale)
    },
    staleTime: APP_CONFIG.TAGS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep modes data in cache longer
  })

  return {
    spells: spellsQuery.data,
    modes: modesQuery.data,
    isLoading: spellsQuery.isLoading,
    isModesLoading: modesQuery.isLoading,
    error: spellsQuery.error,
    refetch: spellsQuery.refetch,
  }
}
