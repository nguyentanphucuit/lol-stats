import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG, getSummonerSpellsDataUrl } from '@/lib/league-config'
import { APP_CONFIG } from '@/lib/constants'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(
      parseInt(
        searchParams.get('limit') || APP_CONFIG.ITEMS_PER_PAGE.toString()
      ),
      APP_CONFIG.MAX_ITEMS_PER_PAGE
    )
    const searchQuery = searchParams.get('q') || ''
    const modes = searchParams.getAll('modes')
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Fetch summoner spells data from DDragon API with specified locale
    const response = await fetch(getSummonerSpellsDataUrl(locale))
    if (!response.ok) {
      throw new Error(`Failed to fetch spells: ${response.status}`)
    }
    const data = await response.json()

    // Transform the data structure from DDragon format to our format
    const allSpells = Object.values(data.data).map((spell: any) => ({
      id: spell.id,
      key: spell.key,
      name: spell.name,
      description: spell.description,
      tooltip: spell.tooltip,
      maxrank: spell.maxrank,
      cooldown: spell.cooldown,
      cooldownBurn: spell.cooldownBurn,
      cost: spell.cost,
      costBurn: spell.costBurn,
      range: spell.range,
      rangeBurn: spell.rangeBurn,
      image: spell.image,
      modes: spell.modes,
      summonerLevel: spell.summonerLevel,
      costType: spell.costType,
      resource: spell.resource,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    // Apply search filter
    let filteredSpells = allSpells
    if (searchQuery) {
      filteredSpells = filteredSpells.filter(
        (spell: any) =>
          spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spell.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spell.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply mode filter
    if (modes.length > 0) {
      filteredSpells = filteredSpells.filter((spell: any) =>
        spell.modes.some((mode: string) => modes.includes(mode))
      )
    }

    // Calculate pagination
    const total = filteredSpells.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSpells = filteredSpells.slice(startIndex, endIndex)

    return NextResponse.json({
      spells: paginatedSpells,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching spells:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spells' },
      { status: 500 }
    )
  }
}
