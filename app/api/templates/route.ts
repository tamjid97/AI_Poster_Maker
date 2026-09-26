import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Template } from '@/types';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';

// GET /api/templates — list templates (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const occasionType = searchParams.get('occasion') || '';
    const activeOnly = searchParams.get('active') !== 'false';

    // Use the centralized DEFAULT_TEMPLATES from lib/default-templates.ts
    let result = [...DEFAULT_TEMPLATES];

    if (activeOnly) {
      result = result.filter((t) => t.is_active !== false);
    }

    if (occasionType) {
      result = result.filter((t) => t.occasion_type === occasionType);
    }

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.occasion_type.toLowerCase().includes(search)
      );
    }

    const response = {
      success: true,
      message: 'Templates fetched successfully',
      data: { templates: result },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch templates';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to fetch templates', errors: [message] },
      { status: 500 }
    );
  }
}
