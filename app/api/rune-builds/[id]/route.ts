import { NextRequest, NextResponse } from 'next/server';
import { RuneBuildsService } from '@/lib/rune-builds-service';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Build ID is required' },
        { status: 400 }
      );
    }

    // Delete the build
    await RuneBuildsService.deleteBuild(id);

    return NextResponse.json(
      { message: 'Rune build deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting rune build:', error);
    return NextResponse.json(
      { error: 'Failed to delete rune build' },
      { status: 500 }
    );
  }
}
