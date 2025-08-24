import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG, getRunesDataUrl } from '@/lib/league-config'
import { APP_CONFIG } from '@/lib/constants'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(
      parseInt(
        searchParams.get('limit') || APP_CONFIG.ITEMS_PER_PAGE.toString()
      ),
      APP_CONFIG.MAX_ITEMS_PER_PAGE
    )
    const searchQuery = searchParams.get('q') || ''
    const styles = searchParams.getAll('styles')
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Fetch runes data from DDragon API with specified locale
    const response = await fetch(getRunesDataUrl(locale))

    if (!response.ok) {
      throw new Error(`Failed to fetch runes: ${response.status}`)
    }

    const data = await response.json()

    // Flatten all runes from all styles and slots
    const allRunes = data.flatMap((style: any) =>
      style.slots.flatMap((slot: any) =>
        slot.runes.map((rune: any) => ({
          id: rune.id,
          key: rune.key,
          icon: rune.icon,
          name: rune.name,
          shortDesc: rune.shortDesc,
          longDesc: rune.longDesc,
          style: style.name,
          styleKey: style.key,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
    )

    // Filter runes based on search query
    let filteredRunes = allRunes

    if (searchQuery) {
      filteredRunes = filteredRunes.filter(
        (rune: any) =>
          rune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rune.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rune.style.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by styles
    if (styles.length > 0) {
      filteredRunes = filteredRunes.filter((rune: any) =>
        styles.includes(rune.styleKey)
      )
    }

    // Calculate pagination
    const total = filteredRunes.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRunes = filteredRunes.slice(startIndex, endIndex)

    return NextResponse.json({
      runes: paginatedRunes,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching runes:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch runes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
