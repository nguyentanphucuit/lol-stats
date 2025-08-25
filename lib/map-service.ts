import { LEAGUE_CONFIG } from './league-config'
import { MapsData } from '@/types'

// Map service functions
export const mapService = {
  // Get map data from Data Dragon API
  getMaps: async (locale?: string): Promise<MapsData> => {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(`/api/maps?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch maps')
    }
    return response.json()
  },

  // Get map image URL from map data
  getMapImageUrl: (imageUrl: string): string => {
    return `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/img/map/${imageUrl}`
  },

  // Get fallback map image URL (placeholder)
  getFallbackMapImageUrl: (): string => {
    return '/images/map-placeholder.png'
  },

  // Get all available map IDs
  getMapIds: (mapsData: MapsData): string[] => {
    return Object.keys(mapsData.data)
  },

  // Get map by ID
  getMapById: (mapsData: MapsData, mapId: string): MapsData['data'][string] | undefined => {
    return mapsData.data[mapId]
  },

  // Get maps filtered by specific IDs
  getMapsByIds: (mapsData: MapsData, mapIds: string[]): MapsData['data'][string][] => {
    return mapIds
      .map(id => mapsData.data[id])
      .filter(Boolean)
  },
}
