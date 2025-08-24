import { StatShard } from '@/types'

// Stat perks configuration - organized by shard slots
export const STAT_PERKS_CONFIG = {
  // English stat shards
  en: [
    // Offense Slot (5001-5003)
    {
      id: 5001,
      name: 'Adaptive Force',
      description:
        'Gain 9 Adaptive Force, granting 5.4 Attack Damage or 9 Ability Power (Adaptive)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png',
      category: 'offense',
    },
    {
      id: 5002,
      name: 'Attack Speed',
      description: 'Gain 10% Attack Speed',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png',
      category: 'offense',
    },
    {
      id: 5003,
      name: 'Ability Haste',
      description: 'Gain 8 Ability Haste',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png',
      category: 'offense',
    },
    // Flex Slot (5004, 5005, 5006)
    {
      id: 5004,
      name: 'Adaptive Force',
      description:
        'Gain 9 Adaptive Force, granting 5.4 Attack Damage or 9 Ability Power (Adaptive)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png',
      category: 'flex',
    },
    {
      id: 5005,
      name: 'Move Speed',
      description: 'Gain 2% Move Speed',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png',
      category: 'flex',
    },
    {
      id: 5006,
      name: 'Health Scaling',
      description: 'Gain 10-180 Health (based on level)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png',
      category: 'flex',
    },
    // Defense Slot (5007, 5008, 5009)
    {
      id: 5007,
      name: 'Health',
      description: 'Gain 65 Health',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png',
      category: 'defense',
    },
    {
      id: 5008,
      name: 'Tenacity and Slow Resist',
      description: 'Gain 10% Tenacity and Slow Resist',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png',
      category: 'defense',
    },
    {
      id: 5009,
      name: 'Health Scaling',
      description: 'Gain 10-180 Health (based on level)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png',
      category: 'defense',
    },
  ] as StatShard[],

  // Vietnamese stat shards
  vi: [
    // Offense Slot (5001-5003)
    {
      id: 5001,
      name: 'Sức Mạnh Thích Nghi',
      description:
        'Nhận 9 Sức Mạnh Thích Nghi, cung cấp 5.4 Sát Thương Tấn Công hoặc 9 Sức Mạnh Kỹ Năng (Thích Nghi)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png',
      category: 'offense',
    },
    {
      id: 5002,
      name: 'Tốc Độ Tấn Công',
      description: 'Nhận 10% Tốc Độ Tấn Công',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png',
      category: 'offense',
    },
    {
      id: 5003,
      name: 'Giảm Hồi Chiêu',
      description: 'Nhận 8 Giảm Hồi Chiêu',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png',
      category: 'offense',
    },
    // Flex Slot (5004, 5005, 5006)
    {
      id: 5004,
      name: 'Sức Mạnh Thích Nghi',
      description:
        'Nhận 9 Sức Mạnh Thích Nghi, cung cấp 5.4 Sát Thương Tấn Công hoặc 9 Sức Mạnh Kỹ Năng (Thích Nghi)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png',
      category: 'flex',
    },
    {
      id: 5005,
      name: 'Tốc Độ Di Chuyển',
      description: 'Nhận 2% Tốc Độ Di Chuyển',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png',
      category: 'flex',
    },
    {
      id: 5006,
      name: 'Máu Theo Cấp',
      description: 'Nhận 10-180 Máu (dựa trên cấp độ)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png',
      category: 'flex',
    },
    // Defense Slot (5007, 5008, 5009)
    {
      id: 5007,
      name: 'Máu',
      description: 'Nhận 65 Máu',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png',
      category: 'defense',
    },
    {
      id: 5008,
      name: 'Kháng Hiệu Ứng và Kháng Phép',
      description: 'Nhận 10% Kháng Hiệu Ứng và Kháng Phép',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png',
      category: 'defense',
    },
    {
      id: 5009,
      name: 'Máu Theo Cấp',
      description: 'Nhận 10-180 Máu (dựa trên cấp độ)',
      iconUrl:
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png',
      category: 'defense',
    },
  ] as StatShard[],
}

// Helper function to get stat perks for a specific locale
export const getStatPerksForLocale = (locale: string): StatShard[] => {
  // Map full locale codes to configuration keys
  const localeMap: Record<string, keyof typeof STAT_PERKS_CONFIG> = {
    en_US: 'en',
    en: 'en',
    vi_VN: 'vi',
    vi: 'vi',
  }

  const configKey = localeMap[locale] || 'en'
  return STAT_PERKS_CONFIG[configKey]
}

// Helper function to get all available locales
export const getAvailableStatPerkLocales = (): string[] => {
  return Object.keys(STAT_PERKS_CONFIG)
}
