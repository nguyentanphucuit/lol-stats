import { LEAGUE_CONFIG } from './league-config'
import { APP_CONFIG } from './constants'

// Spells service functions
export const spellsService = {
  // Get spell image URL from spell data
  getSpellImageUrl: (imageUrl: string): string => {
    // Construct full image URL: DDRAGON_BASE_URL/PATCH/img/spell + spell.image.full
    return `${LEAGUE_CONFIG.SUMMONER_SPELLS_IMAGE_URL}/${imageUrl}`
  },

  // Get fallback spell image URL (placeholder)
  getFallbackImageUrl: (imageUrl: string): string => {
    // Return the same image URL as fallback
    return imageUrl
  },

  // Get spells data
  getSpells: async (params: {
    page: number
    limit: number
    q?: string
    modes?: string[]
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

    if (params.modes && params.modes.length > 0) {
      params.modes.forEach(mode => queryParams.append('modes', mode))
    }

    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    const response = await fetch(`/api/spells?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch spells')
    }
    return response.json()
  },

  // Get spell modes
  getSpellModes: async (locale?: string): Promise<string[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }
    
    const response = await fetch(`/api/spells/modes?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch modes')
    }
    return response.json()
  }
}
