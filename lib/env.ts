// Environment configuration
export const ENV_CONFIG = {
  // League of Legends API
  LEAGUE_PATCH: process.env.NEXT_PUBLIC_LEAGUE_PATCH || '15.16.1',
  DDRAGON_BASE_URL:
    process.env.NEXT_PUBLIC_DDRAGON_BASE_URL ||
    'https://ddragon.leagueoflegends.com/cdn',

  // Application settings
  ITEMS_PER_PAGE: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || '30'),
  MAX_ITEMS_PER_PAGE: parseInt(
    process.env.NEXT_PUBLIC_MAX_ITEMS_PER_PAGE || '1000'
  ),
  MAX_VISIBLE_PAGES: parseInt(
    process.env.NEXT_PUBLIC_MAX_VISIBLE_PAGES || '10'
  ),

  // Cache settings (in milliseconds)
  CHAMPIONS_CACHE_TIME: parseInt(
    process.env.NEXT_PUBLIC_CHAMPIONS_CACHE_TIME || '300000'
  ), // 5 minutes
  TAGS_CACHE_TIME: parseInt(
    process.env.NEXT_PUBLIC_TAGS_CACHE_TIME || '600000'
  ), // 10 minutes

  // Image settings
  CHAMPION_IMAGE_SIZE: parseInt(
    process.env.NEXT_PUBLIC_CHAMPION_IMAGE_SIZE || '48'
  ),
} as const
