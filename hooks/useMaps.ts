import { useQuery } from '@tanstack/react-query'
import { mapService } from '@/lib/map-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'

export function useMaps() {
  const { locale } = useLocale()

  const mapsQuery = useQuery({
    queryKey: ['maps', locale],
    queryFn: async () => {
      return mapService.getMaps(locale)
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep maps data in cache longer
  })

  return {
    maps: mapsQuery.data,
    isLoading: mapsQuery.isLoading,
    error: mapsQuery.error,
    refetch: mapsQuery.refetch,
  }
}
