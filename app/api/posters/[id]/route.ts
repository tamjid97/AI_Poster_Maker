import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import type { ApiResponse, Poster, Template } from '@/types';

// Hardcoded templates - same as in templates API
const HARDCODED_TEMPLATES: Template[] = [
  {
    id: 'tpl-election-campaign',
    title: 'নির্বাচনী প্রচারণা — Election Campaign Premium Poster (SVG)',
    occasion_type: 'political_campaign',
    thumbnail_url: '/templates/election-campaign.svg',
    layout_config: {
      background: {
        gradient: ['#071F18', '#0B3024', '#260F16'],
        texture: 'geometric-pattern',
        decorations: ['flag-motif', 'geometric-pattern', 'gold-lines', 'photo-rings']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '40.6%' }, size: '47.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '14.6%', y: '79.7%' }, size: '17.5%', border: 'gold', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 72, color: '#FFF4B5', effect: 'glow', position: { x: '50%', y: '18.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 76, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '63.6%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 40, color: '#F5D878', effect: 'glow', position: { x: '50%', y: '69.7%' } },
        { field: 'district', font: 'Hind Siliguri', size: 36, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '78%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#063B2A', '#0B5A3E', '#063B2A'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'প্রচারে: ______'
      },
      colorScheme: {
        primary: '#006A4E',
        secondary: '#F42A41',
        accent: '#DDB84A'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-condolence',
    title: 'শোক ও শ্রদ্ধাঞ্জলি — Condolence Premium Poster',
    occasion_type: 'condolence',
    thumbnail_url: '/templates/condolence.svg',
    layout_config: {
      background: {
        gradient: ['#1a2f4a', '#1e3a5f', '#162e4a', '#0f1724'],
        texture: 'rays',
        decorations: ['memorial-border', 'candle', 'dove', 'prayer', 'floral-corner']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '61%' }, size: '40%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '35%', y: '11%' }, size: '9.5%', border: 'gold', glow: false },
        { shape: 'circle', position: { x: '65%', y: '11%' }, size: '9.5%', border: 'gold', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Noto Sans Bengali', size: 50, color: '#d4af37', effect: 'glow', position: { x: '50%', y: '22%' } }
      ],
      namePlate: {
        style: 'bar',
        gradient: ['rgba(212, 175, 55, 0.35)', 'rgba(212, 175, 55, 0.55)', 'rgba(212, 175, 55, 0.35)'],
        textColor: '#ffffff'
      },
      footer: {
        style: 'gradient-bar',
        text: 'স্মরণে: ______'
      },
      colorScheme: {
        primary: '#1e3a5f',
        secondary: '#f4e4bc',
        accent: '#d4af37'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-eid-greeting',
    title: 'পবিত্র ঈদ মোবারক / রমজান — Eid/Ramadan Premium Poster',
    occasion_type: 'eid_greeting',
    thumbnail_url: '/templates/eid-ramadan.svg',
    layout_config: {
      background: {
        gradient: ['#022c22', '#064e3b', '#047857', '#011a17'],
        texture: 'pattern',
        decorations: ['crescent-moon', 'star', 'mosque-silhouette', 'islamic-pattern-border', 'lantern']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '64%' }, size: '40%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '35%', y: '12%' }, size: '9.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '65%', y: '12%' }, size: '9.5%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Noto Sans Bengali', size: 50, color: '#ffd700', effect: 'glow', position: { x: '50%', y: '31%' } }
      ],
      namePlate: {
        style: 'bar',
        gradient: ['#7f1d1d', '#991b1b', '#7f1d1d'],
        textColor: '#ffffff'
      },
      footer: {
        style: 'gradient-bar',
        text: 'শুভেচ্ছা: ______'
      },
      colorScheme: {
        primary: '#047857',
        secondary: '#7f1d1d',
        accent: '#ffd700'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-greeting',
    title: 'শুভেচ্ছা / উৎসব — Greeting Premium Poster',
    occasion_type: 'greeting',
    thumbnail_url: '/templates/greeting.svg',
    layout_config: {
      background: {
        gradient: ['#6d28d9', '#7c3aed', '#8b5cf6', '#4c1d95'],
        texture: 'confetti',
        decorations: ['balloon', 'confetti-corner', 'party-icon', 'sparkle']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '63%' }, size: '40%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '35%', y: '12%' }, size: '9.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '65%', y: '12%' }, size: '9.5%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Noto Sans Bengali', size: 52, color: '#ffffff', effect: 'glow', position: { x: '50%', y: '23%' } }
      ],
      namePlate: {
        style: 'bar',
        gradient: ['#ec4899', '#f472b6', '#ec4899'],
        textColor: '#ffffff'
      },
      footer: {
        style: 'gradient-bar',
        text: 'শুভেচ্ছা: ______'
      },
      colorScheme: {
        primary: '#7c3aed',
        secondary: '#ec4899',
        accent: '#fbbf24'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-victory-day',
    title: 'মহান বিজয় দিবস — Victory Day Premium Poster',
    occasion_type: 'victory_day',
    thumbnail_url: '/templates/victory-day.svg',
    layout_config: {
      background: {
        gradient: ['#003d2d', '#006a4e', '#004d3a', '#002b1b'],
        texture: 'rays',
        decorations: ['floral-corner', 'flag-stripe', 'rice-paddy', 'dove', 'sparkle']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '62%' }, size: '42%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '28%', y: '11%' }, size: '9%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '50%', y: '11%' }, size: '9%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '72%', y: '11%' }, size: '9%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Noto Sans Bengali', size: 54, color: '#ffffff', effect: 'glow', position: { x: '50%', y: '21%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#ffd700', '#ffed4e', '#ffd700'],
        textColor: '#006a4e'
      },
      footer: {
        style: 'gradient-bar',
        text: 'প্রচারে: ______'
      },
      colorScheme: {
        primary: '#006a4e',
        secondary: '#f42a41',
        accent: '#ffd700'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-eid-mubarak',
    title: 'ঈদ মোবারক — Eid Mubarak Premium Poster',
    occasion_type: 'eid_mubarak',
    thumbnail_url: '/templates/eid-mubarak.svg',
    layout_config: {
      background: {
        gradient: ['#FFFDF5', '#FFF9E9', '#F7EFD7'],
        texture: 'subtle-pattern',
        decorations: ['gold-ray', 'mosque-decoration', 'dome', 'minaret']
      },
      photoSlots: [
        { shape: 'organic', position: { x: '67%', y: '47%' }, size: '48%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '9%', y: '9%' }, size: '9%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '19%', y: '9%' }, size: '9%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 78, color: '#07583F', effect: 'none', position: { x: '10%', y: '40%' } },
        { field: 'name', font: 'Hind Siliguri', size: 68, color: '#07583F', effect: 'none', position: { x: '8%', y: '83%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 45, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '96%' } }
      ],
      namePlate: {
        style: 'banner',
        gradient: ['#07563E', '#063E2F', '#042C22'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'ঈদ মোবারক'
      },
      colorScheme: {
        primary: '#08734F',
        secondary: '#F0A52B',
        accent: '#C99930'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

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
    // Handle temporary poster IDs (for testing without DB)
    if (params.id.startsWith('temp-')) {
      console.warn('[POSTER GET] Temporary poster ID detected, returning mock data');
      return NextResponse.json<ApiResponse<{ poster: Poster; html: string }>>(
        {
          success: true,
          message: 'Poster fetched successfully (temporary)',
          data: {
            poster: {
              id: params.id,
              name: 'Test Poster',
              headline: 'Test Headline',
              occasion: 'political_campaign',
              status: 'COMPLETED',
              created_at: new Date().toISOString(),
            } as unknown as Poster,
            html: '<div style="width:1200px;height:1600px;background:#000;display:flex;align-items:center;justify-content:center;color:#fff;">Temporary Poster - No HTML Available</div>',
          },
        },
        { status: 200 }
      );
    }

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

    // Generate HTML for the poster
    let html = '';
    try {
      const template = HARDCODED_TEMPLATES.find((t) => t.id === poster.template_id) || HARDCODED_TEMPLATES[0];
      const { generatePosterHTML } = await import('@/lib/services/poster-render-service');
      html = await generatePosterHTML(poster as unknown as Poster, poster.layout_suggestion as any, template);
    } catch (err) {
      console.error('Failed to generate HTML for poster:', err);
      html = '<div style="width:1200px;height:1600px;background:#000;display:flex;align-items:center;justify-content:center;color:#fff;">Error generating poster</div>';
    }

    return NextResponse.json<ApiResponse<{ poster: Poster; html: string }>>(
      {
        success: true,
        message: 'Poster fetched successfully',
        data: { poster: poster as unknown as Poster, html },
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

