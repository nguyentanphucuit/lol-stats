import { useQuery } from '@tanstack/react-query'
import { runesService } from '@/lib/runes-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'

interface UseRunesParams {
  page: number
  limit: number
  q?: string
  styles?: string[]
}

export function useRunes(params: UseRunesParams) {
  const { locale } = useLocale()
  
  const runesQuery = useQuery({
    queryKey: ['runes', locale, params.q, params.styles, params.page],
    queryFn: async () => {
      return runesService.getRunes({
        page: params.page,
        limit: params.limit,
        q: params.q,
        styles: params.styles,
        locale
      })
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep runes data in cache longer
  })

  const stylesQuery = useQuery({
    queryKey: ['rune-styles', locale],
    queryFn: async (): Promise<string[]> => {
      return runesService.getRuneStyles(locale)
    },
    staleTime: APP_CONFIG.TAGS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep styles data in cache longer
  })

  return {
    runes: runesQuery.data,
    styles: stylesQuery.data,
    isLoading: runesQuery.isLoading,
    isStylesLoading: stylesQuery.isLoading,
    error: runesQuery.error,
    refetch: runesQuery.refetch,
  }
}
