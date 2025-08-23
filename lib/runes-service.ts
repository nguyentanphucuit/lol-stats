import { LEAGUE_CONFIG } from './league-config'
import { APP_CONFIG } from './constants'
import { RuneTree } from '@/types'

// Runes service functions
export const runesService = {
  // Get rune image URL from rune data
  getRuneImageUrl: (imageUrl: string): string => {
    // Construct full image URL: DDRAGON_BASE_URL/img + rune.icon path
    return `${LEAGUE_CONFIG.RUNES_IMAGE_URL}/${imageUrl}`
  },

  // Get fallback rune image URL (placeholder)
  getFallbackImageUrl: (imageUrl: string): string => {
    // Return the same image URL as fallback
    return imageUrl
  },

  // Get runes data
  getRunes: async (params: {
    page: number
    limit: number
    q?: string
    styles?: string[]
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

    if (params.styles && params.styles.length > 0) {
      params.styles.forEach(style => queryParams.append('styles', style))
    }

    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    const response = await fetch(`/api/runes?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch runes')
    }
    return response.json()
  },

  // Get rune styles
  getRuneStyles: async (locale?: string): Promise<string[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }
    
    const response = await fetch(`/api/runes/styles?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch styles')
    }
    return response.json()
  },

  // Get rune trees (complete structure)
  getRuneTrees: async (locale?: string): Promise<RuneTree[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }
    
    const response = await fetch(`/api/runes/trees?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch rune trees')
    }
    return response.json()
  }
}
