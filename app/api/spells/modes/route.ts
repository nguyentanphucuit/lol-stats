import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE
    
    const response = await fetch(LEAGUE_CONFIG.getSummonerSpellsDataUrl(locale))
    if (!response.ok) {
      throw new Error(`Failed to fetch spells: ${response.status}`)
    }
    const data = await response.json()

    // Extract all unique modes from all spells
    const allModes = Object.values(data.data).flatMap((spell: any) => spell.modes)
    const uniqueModes = [...new Set(allModes)].sort()

    return NextResponse.json(uniqueModes)
  } catch (error) {
    console.error('Error fetching spell modes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spell modes' },
      { status: 500 }
    )
  }
}
