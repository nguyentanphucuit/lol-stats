import { NextRequest, NextResponse } from 'next/server'
import { getRunesDataUrl } from '@/lib/league-config'
import { DEFAULT_LOCALE } from '@/lib/locales'
import { RuneTree } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || DEFAULT_LOCALE

    // Fetch runes data from DDragon API with specified locale
    const response = await fetch(getRunesDataUrl(locale))

    if (!response.ok) {
      throw new Error(`Failed to fetch runes: ${response.status}`)
    }

    const data = await response.json()

    // Map the data to the required structure
    const runeTrees: RuneTree[] = data.map((style: any) => ({
      id: style.id,
      key: style.key,
      icon: style.icon,
      name: style.name,
      slots: style.slots.map((slot: any) => ({
        name: slot.name,
        runes: slot.runes.map((rune: any) => ({
          id: rune.id,
          key: rune.key,
          icon: rune.icon,
          name: rune.name,
          shortDesc: rune.shortDesc,
          longDesc: rune.longDesc,
        })),
      })),
    }))

    return NextResponse.json(runeTrees)
  } catch (error) {
    console.error('Error fetching rune trees:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
