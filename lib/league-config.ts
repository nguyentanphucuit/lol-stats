import { ENV_CONFIG } from './env'
import { LOCALE, DEFAULT_LOCALE } from './locales'

// Default locale constant
export const LOCAL = DEFAULT_LOCALE

// League of Legends configuration
export const LEAGUE_CONFIG = {
  // Default patch version
  PATCH: ENV_CONFIG.LEAGUE_PATCH,
  
  // DDragon API base URL
  DDRAGON_BASE_URL: ENV_CONFIG.DDRAION_BASE_URL,
  
  // Default locale
  LOCAL,
  
  // Champion image endpoint
  get CHAMPION_IMAGE_URL() {
    return `${this.DDRAGON_BASE_URL}/${this.PATCH}/img/champion`
  },
  
  // Champion sprite endpoint
  get CHAMPION_SPRITE_URL() {
    return `${this.DDRAGON_BASE_URL}/${this.PATCH}/img/sprite`
  },
  
  // Items image endpoint
  get ITEMS_IMAGE_URL() {
    return `${this.DDRAGON_BASE_URL}/${this.PATCH}/img/item`
  },

  // Runes image endpoint
  get RUNES_IMAGE_URL() {
    return `${this.DDRAGON_BASE_URL}/img`
  },

  // Summoner spells image endpoint
  get SUMMONER_SPELLS_IMAGE_URL() {
    return `${this.DDRAGON_BASE_URL}/${this.PATCH}/img/spell`
  },

  // Stat perks image endpoint
  get STAT_PERKS_IMAGE_URL() {
    return `${this.DDRAGON_BASE_URL}/img`
  }
} as const

// Separate functions that use the config
export const getChampionDataUrl = (locale: string = LOCAL) => {
  return `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/data/${locale}/champion.json`
}

export const getItemsDataUrl = (locale: string = LOCAL) => {
  return `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/data/${locale}/item.json`
}

export const getRunesDataUrl = (locale: string = LOCAL) => {
  return `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/data/${locale}/runesReforged.json`
}

export const getSummonerSpellsDataUrl = (locale: string = LOCAL) => {
  return `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/data/${locale}/summoner.json`
}

// Note: Stat perks are not available in Data Dragon API
// They are managed through local configuration in stat-perks-config.ts
