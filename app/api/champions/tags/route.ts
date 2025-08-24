import { NextRequest, NextResponse } from 'next/server'
import { getChampionDataUrl } from '@/lib/league-config'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Fetch champions data from DDragon API to extract tags with specified locale
    const response = await fetch(getChampionDataUrl(locale))

    if (!response.ok) {
      throw new Error(`Failed to fetch champions: ${response.status}`)
    }

    const data = await response.json()
    const champions = Object.values(data.data)

    // Extract unique tags from all champions
    const allTags = champions.flatMap((champion: any) => champion.tags || [])
    const uniqueTags = [...new Set(allTags)].sort()

    return NextResponse.json(uniqueTags)
  } catch (error) {
    console.error('Error fetching champion tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
