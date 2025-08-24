import { NextRequest, NextResponse } from 'next/server'
import { LEAGUE_CONFIG } from '@/lib/league-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rune: string }> }
) {
  try {
    const { rune } = await params
    const imageUrl = `${LEAGUE_CONFIG.RUNES_IMAGE_URL}/${rune}`

    // Fetch the image from DDragon CDN
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Rune image not found' },
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
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error fetching rune image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rune image' },
      { status: 500 }
    )
  }
}
