import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE
    
    // Fetch items data from DDragon API to extract tags with specified locale
    const response = await fetch(LEAGUE_CONFIG.getItemsDataUrl(locale))
    
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`)
    }
    
    const data = await response.json()
    const items = Object.values(data.data)
    
    // Extract unique tags from all items
    const allTags = items.flatMap((item: any) => item.tags || [])
    const uniqueTags = [...new Set(allTags)].sort()
    
    return NextResponse.json(uniqueTags)
  } catch (error) {
    console.error('Error fetching item tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
