import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE
    
    // Fetch runes data from DDragon API to extract styles with specified locale
    const response = await fetch(LEAGUE_CONFIG.getRunesDataUrl(locale))

    if (!response.ok) {
      throw new Error(`Failed to fetch runes: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract unique style names from all runes
    const uniqueStyles = [...new Set(data.map((style: any) => style.name))].sort()

    return NextResponse.json(uniqueStyles)
  } catch (error) {
    console.error('Error fetching rune styles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
