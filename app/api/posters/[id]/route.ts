import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import type { ApiResponse, Poster } from '@/types';

async function getAuthenticatedClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return { user: null, client: null };
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return { user: null, client: null };
  const client = createServerSupabaseClient(token);
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { user: null, client: null };
  return { user: data.user, client };
}

// GET /api/posters/:id — get a single poster
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, client } = await getAuthenticatedClient(request);
    if (!user || !client) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Authentication required', errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    const { data: poster, error } = await client
      .from('posters')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Failed to fetch poster', errors: [error.message] },
        { status: 500 }
      );
    }

    if (!poster) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Poster not found', errors: ['Poster not found'] },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ poster: Poster }>>(
      {
        success: true,
        message: 'Poster fetched successfully',
        data: { poster: poster as unknown as Poster },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch poster';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to fetch poster', errors: [message] },
      { status: 500 }
    );
  }
}

// DELETE /api/posters/:id — delete a poster
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, client } = await getAuthenticatedClient(request);
    if (!user || !client) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Authentication required', errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    const { error } = await client
      .from('posters')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Failed to delete poster', errors: [error.message] },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Poster deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete poster';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to delete poster', errors: [message] },
      { status: 500 }
    );
  }
}

