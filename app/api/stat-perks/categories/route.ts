import { NextRequest, NextResponse } from 'next/server'
import { getStatPerksForLocale } from '@/lib/stat-perks-config'
import { DEFAULT_LOCALE } from '@/lib/locales'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE
    
    // Get stat perks from configuration to extract categories
    const statPerks = getStatPerksForLocale(locale)
    
    // Extract unique categories from stat perks
    const categories = [...new Set(statPerks.map(perk => perk.category))].sort()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching stat perk categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
