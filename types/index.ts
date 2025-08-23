export interface Champion {
  id: string
  key: string
  name: string
  title: string
  tags: string[]
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface DDragonChampion {
  id: string
  key: string
  name: string
  title: string
  tags: string[]
}

export interface ChampionsResponse {
  champions: Champion[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ChampionsQueryParams {
  q?: string
  tags?: string[]
  page?: number
  limit?: number
}

export interface StatPerk {
  id: string
  key: string
  name: string
  description: string
  icon: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface StatPerksResponse {
  statPerks: StatPerk[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StatPerksQueryParams {
  q?: string
  category?: string
  page?: number
  limit?: number
}

// Stat Shard interface
export interface StatShard {
  id: number
  name: string
  description: string
  iconUrl: string
  category: string
}

export interface Item {
  id: string
  name: string
  description: string
  plaintext: string
  image: string
  gold: {
    base: number
    total: number
    sell: number
    purchasable: boolean
  }
  tags: string[]
  stats: Record<string, number>
  depth: number
  from: string[]
  into: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DDragonItem {
  id: string
  name: string
  description: string
  plaintext: string
  image: {
    full: string
    sprite: string
    group: string
    x: number
    y: number
    w: number
    h: number
  }
  gold: {
    base: number
    total: number
    sell: number
    purchasable: boolean
  }
  tags: string[]
  stats: Record<string, number>
  depth: number
  from: string[]
  into: string[]
}

export interface ItemsResponse {
  items: Item[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ItemsQueryParams {
  q?: string
  tags?: string[]
  page?: number
  limit?: number
}

// Runes interfaces
export interface Rune {
  id: number
  key: string
  icon: string
  name: string
  shortDesc: string
  longDesc: string
  style: string
  styleKey: string
  createdAt: Date
  updatedAt: Date
}

export interface RuneSlot {
  runes: Rune[]
}

export interface RuneStyle {
  id: number
  key: string
  icon: string
  name: string
  slots: RuneSlot[]
}

export interface RunesResponse {
  runes: Rune[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface RunesQueryParams {
  q?: string
  styles?: string[]
  page?: number
  limit?: number
}

// Rune Tree interfaces for the complete structure
export interface RuneTreeRune {
  id: number
  key: string
  icon: string
  name: string
  shortDesc: string
  longDesc: string
}

export interface RuneTreeSlot {
  name: string
  runes: RuneTreeRune[]
}

export interface RuneTree {
  id: number
  key: string
  icon: string
  name: string
  slots: RuneTreeSlot[]
}

export interface Spell {
  id: string
  key: string
  name: string
  description: string
  tooltip: string
  maxrank: number
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  range: number[]
  rangeBurn: string
  image: {
    full: string
    sprite: string
    group: string
    x: number
    y: number
    w: number
    h: number
  }
  modes: string[]
  summonerLevel: number
  costType: string
  resource: string
  createdAt: Date
  updatedAt: Date
}

export interface SpellsResponse {
  spells: Spell[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SpellsQueryParams {
  q?: string
  modes?: string[]
  page?: number
  limit?: number
}

