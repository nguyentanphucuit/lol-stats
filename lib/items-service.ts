import { LEAGUE_CONFIG } from './league-config'
import { APP_CONFIG } from './constants'

// Items service functions
export const itemsService = {
  // Get item image URL from item data
  getItemImageUrl: (imageUrl: string): string => {
    return imageUrl
  },

  // Get fallback item image URL (placeholder)
  getFallbackImageUrl: (imageUrl: string): string => {
    // Return the same image URL as fallback
    return imageUrl
  },

  // Get items data
  getItems: async (params: {
    page: number
    limit: number
    q?: string
    tags?: string[]
    maps?: string[]
    locale?: string
  }) => {
    // Ensure limit doesn't exceed maximum
    const safeLimit = Math.min(params.limit, APP_CONFIG.MAX_ITEMS_PER_PAGE)
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: safeLimit.toString(),
    })

    if (params.q) {
      queryParams.append('q', params.q)
    }

    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag))
    }

    if (params.maps && params.maps.length > 0) {
      params.maps.forEach(map => queryParams.append('maps', map))
    }

    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    const response = await fetch(`/api/items?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch items')
    }
    return response.json()
  },

  // Get item tags
  getItemTags: async (locale?: string): Promise<string[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(`/api/items/tags?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch tags')
    }
    return response.json()
  },
}
