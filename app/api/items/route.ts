import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG, getItemsDataUrl } from '@/lib/league-config'
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
    const tags = searchParams.getAll('tags')
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Fetch items data from DDragon API with specified locale
    const response = await fetch(getItemsDataUrl(locale))

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`)
    }

    const data = await response.json()

    // Get the first item for structure reference
    const firstItem = Object.values(data.data)[0] as any

    const items = Object.values(data.data).map((item: any) => {
      // Convert relative image path to full URL
      let imageUrl: string

      // Use the DDragon base URL directly to construct the image URL
      imageUrl = `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/img/item/${item.image.full}`

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        plaintext: item.plaintext,
        image: imageUrl,
        gold: item.gold,
        tags: item.tags || [],
        stats: item.stats || {},
        depth: item.depth || 1,
        from: item.from || [],
        into: item.into || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    // Filter items based on search query
    let filteredItems = items

    if (searchQuery) {
      filteredItems = filteredItems.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.plaintext.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by tags
    if (tags.length > 0) {
      filteredItems = filteredItems.filter(item =>
        tags.some(tag => item.tags.includes(tag))
      )
    }

    // Calculate pagination
    const total = filteredItems.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = filteredItems.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
