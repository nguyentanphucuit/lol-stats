import { LEAGUE_CONFIG } from './league-config'
import { APP_CONFIG } from './constants'

// Champion service functions
export const championService = {
  // Get champion image URL by champion key
  getChampionImageUrlByKey: (championKey: string): string => {
    if (!championKey || championKey === "unknown") {
      return "https://ddragon.leagueoflegends.com/cdn/img/champion/centered/Unknown.png" // Fallback image
    }
    return `https://ddragon.leagueoflegends.com/cdn/${LEAGUE_CONFIG.PATCH}/img/champion/${championKey}.png`
  },

  // Get champion image URL from champion data (legacy method)
  getChampionImageUrl: (imageUrl: string): string => {
    return imageUrl
  },

  // Get fallback champion image URL (placeholder)
  getFallbackImageUrl: (imageUrl: string): string => {
    // Return the same image URL as fallback
    return imageUrl
  },

  // Get champion data
  getChampions: async (params: {
    page: number
    limit: number
    q?: string
    tags?: string[]
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

    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    const response = await fetch(`/api/champions?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch champions')
    }
    return response.json()
  },

  // Get champion tags
  getChampionTags: async (locale?: string): Promise<string[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(
      `/api/champions/tags?${queryParams.toString()}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch tags')
    }
    return response.json()
  },
}
