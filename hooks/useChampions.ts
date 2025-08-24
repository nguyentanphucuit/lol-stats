import { useQuery } from '@tanstack/react-query'
import { championService } from '@/lib/champion-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'

interface UseChampionsParams {
  page: number
  limit: number
  q?: string
  tags?: string[]
}

export function useChampions(params: UseChampionsParams) {
  const { locale } = useLocale()

  const championsQuery = useQuery({
    queryKey: ['champions', locale, params.q, params.tags, params.page],
    queryFn: async () => {
      return championService.getChampions({
        page: params.page,
        limit: params.limit,
        q: params.q,
        tags: params.tags,
        locale,
      })
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep champions data in cache longer
  })

  const tagsQuery = useQuery({
    queryKey: ['champion-tags', locale],
    queryFn: async (): Promise<string[]> => {
      return championService.getChampionTags(locale)
    },
    staleTime: APP_CONFIG.TAGS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep tags data in cache longer
  })

  return {
    champions: championsQuery.data,
    tags: tagsQuery.data,
    isLoading: championsQuery.isLoading,
    isTagsLoading: tagsQuery.isLoading,
    error: championsQuery.error,
    refetch: championsQuery.refetch,
  }
}
