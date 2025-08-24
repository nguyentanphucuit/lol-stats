import { useQuery } from '@tanstack/react-query'
import { statPerksService } from '@/lib/stat-perks-service'
import { useLocale } from '@/components/providers/locale-provider'
import { APP_CONFIG } from '@/lib/constants'

interface UseStatPerksParams {
  page: number
  limit: number
  q?: string
}

export function useStatPerks(params: UseStatPerksParams) {
  const { locale } = useLocale()

  const statPerksQuery = useQuery({
    queryKey: ['stat-perks', locale, params.q, params.page],
    queryFn: async () => {
      return statPerksService.getStatPerks({
        page: params.page,
        limit: params.limit,
        q: params.q,
        locale,
      })
    },
    staleTime: APP_CONFIG.CHAMPIONS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  const categoriesQuery = useQuery({
    queryKey: ['stat-perks-categories', locale],
    queryFn: async (): Promise<string[]> => {
      return statPerksService.getStatPerksCategories(locale)
    },
    staleTime: APP_CONFIG.TAGS_CACHE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  return {
    statPerks: statPerksQuery.data,
    categories: categoriesQuery.data,
    isLoading: statPerksQuery.isLoading,
    isCategoriesLoading: categoriesQuery.isLoading,
    error: statPerksQuery.error,
    refetch: statPerksQuery.refetch,
  }
}
