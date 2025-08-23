import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'
import { APP_CONFIG } from '@/lib/constants'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || APP_CONFIG.ITEMS_PER_PAGE.toString()), APP_CONFIG.MAX_ITEMS_PER_PAGE)
    const searchQuery = searchParams.get('q') || ''
    const tags = searchParams.getAll('tags')
    const locale = searchParams.get('locale') || DEFAULT_LOCALE
    
    // Fetch champions data from DDragon API with specified locale
    const response = await fetch(LEAGUE_CONFIG.getChampionDataUrl(locale))
    
    if (!response.ok) {
      throw new Error(`Failed to fetch champions: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Get the first champion for structure reference
    const firstChampion = Object.values(data.data)[0] as any
    
    const champions = Object.values(data.data).map((champion: any) => {
      // Convert relative image path to full URL, with fallback to champion key
      let imageUrl: string
      
      // Use the DDragon base URL directly to construct the image URL
      imageUrl = `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/img/champion/${champion.image.full}`
      
      return {
        id: champion.id,
        key: champion.key,
        name: champion.name,
        title: champion.title,
        tags: champion.tags,
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    // Filter champions based on search query
    let filteredChampions = champions
    
    if (searchQuery) {
      filteredChampions = filteredChampions.filter(champion =>
        champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by tags
    if (tags.length > 0) {
      filteredChampions = filteredChampions.filter(champion =>
        tags.some(tag => champion.tags.includes(tag))
      )
    }
    
    // Calculate pagination
    const total = filteredChampions.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedChampions = filteredChampions.slice(startIndex, endIndex)
    
    return NextResponse.json({
      champions: paginatedChampions,
      total,
      page,
      limit,
      totalPages
    })
    
  } catch (error) {
    console.error('Error fetching champions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch champions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
