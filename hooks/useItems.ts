import { useQuery } from '@tanstack/react-query'
import { itemsService } from '@/lib/items-service'
import { APP_CONFIG } from '@/lib/constants'
import { useLocale } from '@/components/providers/locale-provider'

interface UseItemsParams {
  page: number
  limit: number
  q?: string
  tags?: string[]
  maps?: string[]
}

export function useItems(params: UseItemsParams) {
  const { locale } = useLocale()

  const itemsQuery = useQuery({
    queryKey: ['items', locale, params.q, params.tags, params.maps, params.page],
    queryFn: async () => {
      return itemsService.getItems({
        page: params.page,
        limit: params.limit,
        q: params.q,
        tags: params.tags,
        maps: params.maps,
        locale,
      })
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep items data in cache longer
  })

  const tagsQuery = useQuery({
    queryKey: ['item-tags', locale],
    queryFn: async (): Promise<string[]> => {
      return itemsService.getItemTags(locale)
    },
    staleTime: APP_CONFIG.TAGS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes - keep tags data in cache longer
  })

  return {
    items: itemsQuery.data,
    tags: tagsQuery.data,
    isLoading: itemsQuery.isLoading,
    isTagsLoading: tagsQuery.isLoading,
    error: itemsQuery.error,
    refetch: itemsQuery.refetch,
  }
}
