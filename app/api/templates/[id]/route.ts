import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';
import type { ApiResponse, Template } from '@/types';

function isUUID(str?: string | null): boolean {
  return Boolean(
    str &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        str
      )
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let template: Template | null = null;

    if (isUUID(params.id)) {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', params.id)
          .maybeSingle();

        if (!error && data) {
          template = data as unknown as Template;
        }
      } catch (err) {
        console.warn('Error querying template by ID from DB:', err);
      }
    }

    if (!template) {
      template = DEFAULT_TEMPLATES.find((t) => t.id === params.id) || null;
    }

    if (!template) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Template not found', errors: ['Template not found'] },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ template: Template }>>(
      {
        success: true,
        message: 'Template fetched successfully',
        data: { template },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch template';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to fetch template', errors: [message] },
      { status: 500 }
    );
  }
}

