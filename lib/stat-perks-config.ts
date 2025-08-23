import { StatShard } from '@/types'

// Stat perks configuration - centralized and maintainable
export const STAT_PERKS_CONFIG = {
  // English stat shards
  en: [
    {
      id: 5001,
      name: "Adaptive Force",
      description: "Gain 9 Adaptive Force, granting 9 Attack Damage or 15 Ability Power (Adaptive)",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png",
      category: "Stat Shard"
    },
    {
      id: 5002,
      name: "Attack Speed",
      description: "Gain 10% Attack Speed",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png",
      category: "Stat Shard"
    },
    {
      id: 5003,
      name: "Ability Haste",
      description: "Gain 8 Ability Haste",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png",
      category: "Stat Shard"
    },
    {
      id: 5004,
      name: "Move Speed",
      description: "Gain 1% Move Speed",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png",
      category: "Stat Shard"
    },
    {
      id: 5005,
      name: "Armor",
      description: "Gain 6 Armor",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsarmoricon.png",
      category: "Stat Shard"
    },
    {
      id: 5007,
      name: "Magic Resist",
      description: "Gain 8 Magic Resist",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png",
      category: "Stat Shard"
    },
    {
      id: 5008,
      name: "Health",
      description: "Gain 15-140 Health (based on level)",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png",
      category: "Stat Shard"
    }
  ] as StatShard[],

  // Vietnamese stat shards
  vi: [
    {
      id: 5001,
      name: "Sức Mạnh Thích Nghi",
      description: "Nhận 9 Sức Mạnh Thích Nghi, cung cấp 9 Sát Thương Tấn Công hoặc 15 Sức Mạnh Kỹ Năng (Thích Nghi)",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png",
      category: "Stat Shard"
    },
    {
      id: 5002,
      name: "Tốc Độ Tấn Công",
      description: "Nhận 10% Tốc Độ Tấn Công",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png",
      category: "Stat Shard"
    },
    {
      id: 5003,
      name: "Giảm Hồi Chiêu",
      description: "Nhận 8 Giảm Hồi Chiêu",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png",
      category: "Stat Shard"
    },
    {
      id: 5004,
      name: "Tốc Độ Di Chuyển",
      description: "Nhận 1% Tốc Độ Di Chuyển",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png",
      category: "Stat Shard"
    },
    {
      id: 5005,
      name: "Giáp",
      description: "Nhận 6 Giáp",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsarmoricon.png",
      category: "Stat Shard"
    },
    {
      id: 5007,
      name: "Kháng Phép",
      description: "Nhận 8 Kháng Phép",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png",
      category: "Stat Shard"
    },
    {
      id: 5008,
      name: "Máu",
      description: "Nhận 15-140 Máu (dựa trên cấp độ)",
      iconUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png",
      category: "Stat Shard"
    }
  ] as StatShard[]
}

// Helper function to get stat perks for a specific locale
export const getStatPerksForLocale = (locale: string): StatShard[] => {
  // Map full locale codes to configuration keys
  const localeMap: Record<string, keyof typeof STAT_PERKS_CONFIG> = {
    'en_US': 'en',
    'en': 'en',
    'vi_VN': 'vi',
    'vi': 'vi'
  }
  
  const configKey = localeMap[locale] || 'en'
  return STAT_PERKS_CONFIG[configKey]
}

// Helper function to get all available locales
export const getAvailableStatPerkLocales = (): string[] => {
  return Object.keys(STAT_PERKS_CONFIG)
}
