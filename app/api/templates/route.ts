import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';
import type { ApiResponse, Template } from '@/types';

// Dynamically allow all DEFAULT_TEMPLATES
const ALLOWED_TEMPLATE_IDS = new Set(DEFAULT_TEMPLATES.map((t) => t.id));

// GET /api/templates — list templates (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const occasionType = searchParams.get('occasion') || '';
    const activeOnly = searchParams.get('active') !== 'false';

    let dbTemplates: Template[] = [];
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        dbTemplates = data as unknown as Template[];
      }
    } catch (err) {
      console.warn('Error querying templates from DB, using defaults:', err);
    }

    const allTemplatesMap = new Map<string, Template>();

    // Add DB custom templates first (excluding default template IDs)
    for (const t of dbTemplates) {
      if (!ALLOWED_TEMPLATE_IDS.has(t.id) && t.is_active !== false) {
        allTemplatesMap.set(t.id, t);
      }
    }

    // DEFAULT_TEMPLATES always take precedence for built-in template IDs
    for (const t of DEFAULT_TEMPLATES) {
      allTemplatesMap.set(t.id, t);
    }

    let result = Array.from(allTemplatesMap.values());

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

    return NextResponse.json<ApiResponse<{ templates: Template[] }>>(
      {
        success: true,
        message: 'Templates fetched successfully',
        data: { templates: result },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch templates';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to fetch templates', errors: [message] },
      { status: 500 }
    );
  }
}
