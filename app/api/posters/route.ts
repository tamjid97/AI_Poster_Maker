import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { generatePosterHTML, resolveTemplate } from '@/lib/services/poster-render-service';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';
import type { ApiResponse, Poster, LayoutSuggestion, Template } from '@/types';

function isUUID(str?: string | null): boolean {
  return Boolean(
    str &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        str
      )
  );
}

/**
 * Returns a storable template ID string — either the provided one or derived from the resolved template.
 * Unlike isUUID, this accepts both UUID and non-UUID IDs (e.g., 'tpl-political-campaign').
 */
function getStorableTemplateId(providedId?: string | null, resolvedId?: string): string | null {
  const id = providedId || resolvedId || null;
  return id || null;
}

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

/**
 * Build a deterministic layout suggestion from the template's own config.
 * No Gemini AI is used — colors and layout come directly from the template.
 */
function buildLayoutFromTemplate(template: Template): LayoutSuggestion {
  const config = template.layout_config;
  const primaryColor = config.primaryColor || '#006a4e';
  const secondaryColor = config.secondaryColor || '#f42a41';
  const accentColor = config.accentColor || '#ffd700';
  const textColor = config.textColor || '#ffffff';

  return {
    layout: 'Template-based structured layout',
    colorPalette: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: config.bgStyle === 'gradient' ? (config.bgFrom || primaryColor) : (config.bgColor || '#1a1a1a'),
      text: textColor,
    },
    photoPlacement: config.photoLayout || 'main-with-three',
    typography: {
      headline: 'Bold, large, centered',
      body: 'Regular, readable',
      hierarchy: 'Headline > Name > Designation > Organization > Location',
    },
    decorativeElements: config.decorativeElements || [],
    visualStyle: `Professional ${template.occasion_type} poster`,
    composition: 'Structured template layout',
    backgroundDecoration: config.bgStyle === 'gradient' ? 'Gradient background' : 'Solid background',
  };
}

// POST /api/posters — create a new poster
export async function POST(request: NextRequest) {
  try {
    const { user, client } = await getAuthenticatedClient(request);
    if (!user || !client) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Authentication required', errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const errors: string[] = [];
    if (!body.name?.trim()) errors.push('Name is required');
    if (!body.occasion?.trim()) errors.push('Occasion is required');
    if (!body.headline?.trim()) errors.push('Headline is required');

    if (errors.length > 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Resolve template: explicit selection ONLY - no fallbacks
    let template: Template | null = null;

    console.log('========================================');
    console.log('[CRITICAL DEBUG] POST /api/posters - template resolution');
    console.log('[CRITICAL DEBUG] body.templateId:', body.templateId);
    console.log('[CRITICAL DEBUG] body.occasion:', body.occasion);
    console.log('[CRITICAL DEBUG] body.name:', body.name);
    console.log('[CRITICAL DEBUG] body.headline:', body.headline);
    console.log('[CRITICAL DEBUG] Available templates:', DEFAULT_TEMPLATES.map(t => ({ id: t.id, title: t.title, occasion: t.occasion_type })));
    console.log('========================================');

    // REQUIRE explicit template selection
    if (!body.templateId) {
      console.error('[CRITICAL DEBUG] NO TEMPLATE ID PROVIDED - returning error');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Template selection is required',
          errors: ['Please select a template from the template library before creating a poster.'],
        },
        { status: 400 }
      );
    }

    // Check built-in templates first
    template = DEFAULT_TEMPLATES.find((t) => t.id === body.templateId) || null;
    console.log('[CRITICAL DEBUG] found in DEFAULT_TEMPLATES:', template?.id, template?.title);

    // If not found in defaults, try DB (UUID-based templates)
    if (!template && isUUID(body.templateId)) {
      try {
        const { data: templateData } = await client
          .from('templates')
          .select('*')
          .eq('id', body.templateId)
          .maybeSingle();
        if (templateData) {
          template = templateData as unknown as Template;
          console.log('[CRITICAL DEBUG] found in DB:', template?.id, template?.title);
        }
      } catch (err) {
        console.warn('Error fetching template from DB:', err);
      }
    }

    // NO FALLBACK: If template not found, return error
    if (!template) {
      console.error('[CRITICAL DEBUG] TEMPLATE NOT FOUND - returning error');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Selected template not found: ${body.templateId}`,
          errors: [`Template "${body.templateId}" does not exist. Available templates: ${DEFAULT_TEMPLATES.map(t => t.id).join(', ')}`],
        },
        { status: 404 }
      );
    }

    console.log('[CRITICAL DEBUG] FINAL resolved template:', template?.id, template?.title);

    // Determine the storable template ID (works for both UUIDs and built-in IDs like 'tpl-*')
    const storableTemplateId = getStorableTemplateId(body.templateId, template.id);

    // Create poster record with GENERATING status
    // IMPORTANT: template_id is a UUID FK column in PostgreSQL.
    // For built-in templates ('tpl-*'), we cannot store the string ID here — it would cause a type error.
    // Instead, we store the template ID in layout_suggestion.templateId (JSONB, any string allowed).
    const { data: poster, error: insertError } = await client
      .from('posters')
      .insert({
        user_id: user.id,
        // Only store UUID template IDs in the typed FK column
        template_id: isUUID(body.templateId) ? body.templateId : null,
        name: body.name,
        designation: body.designation || null,
        party: body.party || null,
        organization: body.organization || null,
        union_or_thana: body.unionOrThana || null,
        district: body.district || null,
        occasion: body.occasion,
        headline: body.headline,
        photo_urls: body.photoUrls || [],
        status: 'GENERATING',
      })
      .select('*')
      .single();

    if (insertError || !poster) {
      console.error('Poster insert error:', insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Failed to create poster', errors: [insertError?.message || 'Unknown error'] },
        { status: 500 }
      );
    }

    // Build layout deterministically from the template config
    const baseLayout = buildLayoutFromTemplate(template);
    // Always embed templateId in layout_suggestion as a reliable recovery path
    const resolvedTemplateId = storableTemplateId || template.id;
    const layoutSuggestion = {
      ...baseLayout,
      templateId: resolvedTemplateId,
    };

    // Generate poster HTML using template-aware rendering
    const posterRecord = {
      ...(poster as unknown as Poster),
      template_id: resolvedTemplateId,
    };
    const html = generatePosterHTML(posterRecord, layoutSuggestion as any, template);

    // Store the layout suggestion and mark as completed
    // Also update template_id here in case the insert didn't accept it (schema fallback)
    const updatePayload: Record<string, unknown> = {
      layout_suggestion: layoutSuggestion as unknown as Record<string, unknown>,
      status: 'COMPLETED',
    };
    // Try to persist the template_id in the update as well (some DB schemas only allow UUID in that column)
    if (isUUID(resolvedTemplateId)) {
      updatePayload.template_id = resolvedTemplateId;
    }
    const { data: updatedPoster, error: updateError } = await client
      .from('posters')
      .update(updatePayload)
      .eq('id', poster.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Poster update error:', updateError);
    }

    return NextResponse.json<ApiResponse<{ poster: Poster; html: string; layout: LayoutSuggestion }>>(
      {
        success: true,
        message: 'Poster created successfully',
        data: {
          poster: (updatedPoster || poster) as unknown as Poster,
          html,
          layout: layoutSuggestion,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Poster creation failed';
    console.error('Poster creation error:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Poster creation failed', errors: [message] },
      { status: 500 }
    );
  }
}

// GET /api/posters — list user's posters
export async function GET(request: NextRequest) {
  try {
    const { user, client } = await getAuthenticatedClient(request);
    if (!user || !client) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Authentication required', errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data: posters, error } = await client
      .from('posters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Fetch posters error:', error);
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Failed to fetch posters', errors: [error.message] },
        { status: 500 }
      );
    }

    const { count, error: countError } = await client
      .from('posters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Count posters error:', countError);
    }

    return NextResponse.json<ApiResponse<{ posters: Poster[]; total: number; page: number; totalPages: number }>>(
      {
        success: true,
        message: 'Posters fetched successfully',
        data: {
          posters: (posters || []) as unknown as Poster[],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch posters';
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Failed to fetch posters', errors: [message] },
      { status: 500 }
    );
  }
}
