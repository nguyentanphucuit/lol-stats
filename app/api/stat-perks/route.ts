import { NextRequest, NextResponse } from 'next/server'
import { getStatPerksForLocale } from '@/lib/stat-perks-config'
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
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Get stat perks from configuration based on locale
    const allStatPerks = getStatPerksForLocale(locale)

    // Filter stat perks based on search query
    let filteredStatPerks = allStatPerks

    if (searchQuery) {
      filteredStatPerks = allStatPerks.filter(
        perk =>
          perk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perk.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Calculate pagination
    const total = filteredStatPerks.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedStatPerks = filteredStatPerks.slice(startIndex, endIndex)

    // Transform data to match expected format
    const transformedStatPerks = paginatedStatPerks.map(perk => ({
      ...perk,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    return NextResponse.json({
      statPerks: transformedStatPerks,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  } catch (error) {
    console.error('Error fetching stat perks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
