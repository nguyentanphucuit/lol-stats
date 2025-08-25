import { NextRequest, NextResponse } from 'next/server';
import { RuneBuildsService, RuneBuildData } from '@/lib/rune-builds-service';

export async function GET() {
  try {
    const runeBuilds = await RuneBuildsService.getAllBuilds();
    return NextResponse.json(runeBuilds);
  } catch (error) {
    console.error('Error fetching rune builds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rune builds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const buildData: RuneBuildData = body;

    // Validate required fields
    if (!buildData.gameMode || !buildData.primaryTreeId || !buildData.secondaryTreeId || !buildData.selectedItems1) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the build
    const savedBuild = await RuneBuildsService.saveBuild(buildData);

    return NextResponse.json(
      { 
        message: 'Rune build saved successfully',
        build: savedBuild 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving rune build:', error);
    return NextResponse.json(
      { error: 'Failed to save rune build' },
      { status: 500 }
    );
  }
}
