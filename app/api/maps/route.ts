import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en_US'
    
    // Fetch maps data from Data Dragon API
    const response = await fetch(
      `${LEAGUE_CONFIG.DDRAGON_BASE_URL}/${LEAGUE_CONFIG.PATCH}/data/${locale}/map.json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch maps from Data Dragon API')
    }

    const mapsData = await response.json()

    // Return the maps data
    return NextResponse.json(mapsData)
  } catch (error) {
    console.error('Error fetching maps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maps' },
      { status: 500 }
    )
  }
}
