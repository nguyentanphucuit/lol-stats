import { APP_CONFIG } from './constants'

// Stat perks service functions (using configuration-based data)
export const statPerksService = {
  // Get stat perks data
  getStatPerks: async (params: {
    page: number
    limit: number
    q?: string
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

    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    const response = await fetch(`/api/stat-perks?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch stat perks')
    }
    return response.json()
  },

  // Get stat perks categories
  getStatPerksCategories: async (locale?: string): Promise<string[]> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }
    
    const response = await fetch(`/api/stat-perks/categories?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch stat perks categories')
    }
    return response.json()
  }
}
