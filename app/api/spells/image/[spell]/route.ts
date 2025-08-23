import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spell: string }> }
) {
  try {
    const { spell } = await params
    const imageUrl = `${LEAGUE_CONFIG.SUMMONER_SPELLS_IMAGE_URL}/${spell}`

    // Fetch the image from DDragon CDN
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Spell image not found' },
        { status: 404 }
      )
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Error fetching spell image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spell image' },
      { status: 500 }
    )
  }
}
