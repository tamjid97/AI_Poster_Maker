import type { Poster, LayoutSuggestion, Template } from '@/types';

// Hardcoded templates - same as in templates API
const HARDCODED_TEMPLATES: Template[] = [
  {
    id: 'tpl-victory-day',
    title: 'মহান বিজয় দিবস — Victory Day Premium Poster (SVG)',
    occasion_type: 'victory_day',
    thumbnail_url: '/templates/template-1.svg',
    layout_config: {
      background: {
        gradient: ['#041E15', '#083827', '#2D0A0E'],
        texture: 'sunburst',
        decorations: ['national-memorial', 'flag-motif', 'gold-border', 'photo-rings']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '40.6%' }, size: '47.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '15%', y: '84.4%' }, size: '17.5%', border: 'gold', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 70, color: '#FFF8D6', effect: 'glow', position: { x: '50%', y: '18.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 72, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '64.1%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 38, color: '#FCE582', effect: 'glow', position: { x: '50%', y: '69.7%' } },
        { field: 'district', font: 'Hind Siliguri', size: 34, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '77.4%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#032D1F', '#09543B', '#032D1F'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'প্রচারে: আপনার বার্তা এখানে'
      },
      colorScheme: {
        primary: '#006A4E',
        secondary: '#F42A41',
        accent: '#E2B842'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-condolence',
    title: 'শোক ও শ্রদ্ধাঞ্জলি — Condolence Premium Poster (SVG)',
    occasion_type: 'condolence',
    thumbnail_url: '/templates/template-2.svg',
    layout_config: {
      background: {
        gradient: ['#0A0A0A', '#141816', '#1F080A'],
        texture: 'solemn',
        decorations: ['black-ribbon', 'candle', 'silver-border', 'memorial']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '40.6%' }, size: '47.5%', border: 'silver', glow: true },
        { shape: 'circle', position: { x: '15%', y: '84.4%' }, size: '17.5%', border: 'silver', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 64, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '18.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 72, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '64.1%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 38, color: '#D1C097', effect: 'glow', position: { x: '50%', y: '69.7%' } },
        { field: 'district', font: 'Hind Siliguri', size: 34, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '77.4%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#071A12', '#0F3827', '#071A12'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'শোকাহতে: আপনার বার্তা এখানে'
      },
      colorScheme: {
        primary: '#141816',
        secondary: '#1F080A',
        accent: '#D1C097'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-election-campaign',
    title: 'নির্বাচনী প্রচারণা — Election Campaign Premium Poster (SVG)',
    occasion_type: 'political_campaign',
    thumbnail_url: '/templates/template-3.svg',
    layout_config: {
      background: {
        gradient: ['#022B18', '#06482B', '#3B080C'],
        texture: 'campaign',
        decorations: ['party-symbol', 'bold-border', 'gold-accent', 'photo-rings']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '40.6%' }, size: '47.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '15%', y: '84.4%' }, size: '17.5%', border: 'gold', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 68, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '18.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 74, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '64.1%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 40, color: '#FFF8B3', effect: 'glow', position: { x: '50%', y: '69.7%' } },
        { field: 'district', font: 'Hind Siliguri', size: 36, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '77.5%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#044227', '#06482B', '#044227'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'প্রচারে: এলাকার সর্বস্তরের জনগণ / আপনার বার্তা'
      },
      colorScheme: {
        primary: '#06482B',
        secondary: '#D61834',
        accent: '#F2C238'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-eid-greeting',
    title: 'পবিত্র ঈদ মোবারক — Eid Greeting Premium Poster (SVG)',
    occasion_type: 'eid_greeting',
    thumbnail_url: '/templates/template-4.svg',
    layout_config: {
      background: {
        gradient: ['#012419', '#044833', '#1A0D26'],
        texture: 'festive',
        decorations: ['crescent-moon', 'star', 'festive-border', 'mandala-ring']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '40.6%' }, size: '47.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '15%', y: '84.4%' }, size: '17.5%', border: 'gold', glow: false }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 74, color: '#FFEAA7', effect: 'glow', position: { x: '50%', y: '18.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 72, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '64.1%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 38, color: '#FFEAA7', effect: 'glow', position: { x: '50%', y: '69.7%' } },
        { field: 'district', font: 'Hind Siliguri', size: 34, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '77.4%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#033B2A', '#044833', '#033B2A'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'শুভেচ্ছান্তে: আপনার বার্তা এখানে'
      },
      colorScheme: {
        primary: '#044833',
        secondary: '#B31248',
        accent: '#EBB634'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-youth-rally',
    title: 'তরুণ ও যুব সমাবেশ — Youth Rally Premium Poster (SVG)',
    occasion_type: 'political_campaign',
    thumbnail_url: '/templates/template-5.svg',
    layout_config: {
      background: {
        gradient: ['#051923', '#006466', '#0B2545'],
        texture: 'rally',
        decorations: ['leader-photos', 'emblem', 'event-info', 'gold-border']
      },
      photoSlots: [
        { shape: 'circle', position: { x: '50%', y: '43.8%' }, size: '46.7%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '10%', y: '7.5%' }, size: '8.3%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '18.8%', y: '7.5%' }, size: '8.3%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '81.3%', y: '7.5%' }, size: '8.3%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '90%', y: '7.5%' }, size: '8.3%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 66, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '20.6%' } },
        { field: 'name', font: 'Hind Siliguri', size: 68, color: '#FFFFFF', effect: 'glow', position: { x: '50%', y: '68.1%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 36, color: '#E9C46A', effect: 'glow', position: { x: '50%', y: '73.8%' } },
        { field: 'district', font: 'Hind Siliguri', size: 34, color: '#FFFFFF', effect: 'none', position: { x: '50%', y: '79.7%' } }
      ],
      namePlate: {
        style: 'ribbon',
        gradient: ['#E76F51', '#E76F51', '#E76F51'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'প্রচারে: সর্বস্তরের ছাত্র ও যুবজনতা'
      },
      colorScheme: {
        primary: '#006466',
        secondary: '#E76F51',
        accent: '#E9C46A'
      }
    },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-eid-mubarak',
    title: 'ঈদ মোবারক — Eid Mubarak Premium Poster',
    occasion_type: 'eid_mubarak',
    thumbnail_url: '/templates/svg/eid-mobarak-v2.svg',
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
    is_active: false, // Disabled - blank thumbnail due to minimal design
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-eid-mobarak-v2',
    title: 'ঈদ মোবারক — লিডার ফটো (Eid Mubarak with Leader Photos)',
    occasion_type: 'eid_mubarak',
    thumbnail_url: '/templates/svg/eid-mobarak-v2.svg',
    layout_config: {
      background: {
        gradient: ['#fffaf0', '#fff5df', '#f9e8c5'],
        texture: 'subtle-pattern',
        decorations: ['lantern', 'burst', 'moon', 'star']
      },
      photoSlots: [
        { shape: 'bust', position: { x: '36.25%', y: '60.94%' }, size: '27.5%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '17.92%', y: '10.81%' }, size: '18.67%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '10.83%', y: '20.81%' }, size: '12%', border: 'gold', glow: true },
        { shape: 'circle', position: { x: '24.33%', y: '20.81%' }, size: '12%', border: 'gold', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 122, color: '#e88919', effect: 'gradient', position: { x: '50%', y: '46.56%' } },
        { field: 'name', font: 'Hind Siliguri', size: 58, color: '#ffffff', effect: 'none', position: { x: '50%', y: '89.38%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 28, color: '#e9e6d8', effect: 'none', position: { x: '50%', y: '93.13%' } }
      ],
      namePlate: {
        style: 'banner',
        gradient: ['#075b3a', '#063c2b'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'ঈদ মোবারক'
      },
      colorScheme: {
        primary: '#075b3a',
        secondary: '#e88919',
        accent: '#d99a24'
      }
    },
    is_active: false, // Disabled - blank thumbnail due to minimal design
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-leadership-poster',
    title: 'নতুন নেতৃত্ব — Leadership and Change Poster',
    occasion_type: 'leadership',
    thumbnail_url: '/templates/svg/leadership-poster.svg',
    layout_config: {
      background: {
        gradient: ['#ffffff', '#dff8ff'],
        texture: 'subtle-pattern',
        decorations: ['dove', 'emblem', 'blue-dots']
      },
      photoSlots: [
        { shape: 'path', position: { x: '1.67%', y: '48.62%' }, size: '53.75%', border: 'none', glow: false },
        { shape: 'circle', position: { x: '14.58%', y: '9.54%' }, size: '12%', border: 'white', glow: true }
      ],
      textSlots: [
        { field: 'headline', font: 'Hind Siliguri', size: 108, color: '#ff1b1b', effect: 'gradient', position: { x: '77.5%', y: '62.15%' } },
        { field: 'name', font: 'Hind Siliguri', size: 47, color: '#ffffff', effect: 'none', position: { x: '58.33%', y: '87.26%' } },
        { field: 'designation', font: 'Hind Siliguri', size: 27, color: '#ffe86b', effect: 'none', position: { x: '58.33%', y: '90.28%' } }
      ],
      namePlate: {
        style: 'banner',
        gradient: ['#ed1515'],
        textColor: '#FFFFFF'
      },
      footer: {
        style: 'gradient-bar',
        text: 'নতুন নেতৃত্ব'
      },
      colorScheme: {
        primary: '#079c45',
        secondary: '#ff1717',
        accent: '#f1d76a'
      }
    },
    is_active: false, // Disabled - blank thumbnail due to minimal design
    created_at: new Date().toISOString(),
  },
];

/**
 * Escape HTML to prevent XSS and properly render text
 */
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resolve which template to use for rendering.
 * Priority order (consistent with API routes):
 *   1) layout_suggestion.templateId   <- built-in `tpl-*` IDs ALWAYS live here
 *   2) poster.template_id (UUID or legacy)
 *   3) occasion_type match against HARDCODED_TEMPLATES (only active templates)
 *   4) warn + HARDCODED_TEMPLATES[0] fallback (only active templates)
 */
export function resolveTemplate(poster: Poster, template?: Template | null): Template {
  if (template) return template;

  const layoutTemplateId = (poster.layout_suggestion as any)?.templateId as string | null;
  const storedTemplateId = poster.template_id;
  const posterOccasion = poster.occasion;

  // Filter to only active templates
  const ACTIVE_TEMPLATES = HARDCODED_TEMPLATES.filter(t => t.is_active !== false);

  let resolved: Template | null = null;
  let resolutionPath = 'stepD';

  // Step A: layout_suggestion.templateId first (built-in tpl-* IDs always stored here)
  if (!resolved && layoutTemplateId) {
    const exact = ACTIVE_TEMPLATES.find((t) => t.id === layoutTemplateId);
    if (exact) { resolved = exact; resolutionPath = 'stepA-layout_suggestion.templateId-exact'; }
    else {
      const partial = ACTIVE_TEMPLATES.find(
        (t) => t.id.includes(layoutTemplateId) || layoutTemplateId.includes(t.id)
      );
      if (partial) { resolved = partial; resolutionPath = 'stepA-layout_suggestion.templateId-partial'; }
    }
  }

  // Step B: poster.template_id (UUID path or direct built-in ID)
  if (!resolved && storedTemplateId) {
    const exact = ACTIVE_TEMPLATES.find((t) => t.id === storedTemplateId);
    if (exact) { resolved = exact; resolutionPath = 'stepB-template_id-exact'; }
    else {
      const partial = ACTIVE_TEMPLATES.find(
        (t) => t.id.includes(storedTemplateId) || storedTemplateId.includes(t.id)
      );
      if (partial) { resolved = partial; resolutionPath = 'stepB-template_id-partial'; }
      else {
        // Legacy mapping fallback
        const idMapping: Record<string, string> = {
          'election-campaign': 'tpl-election-campaign',
        };
        const mapped = idMapping[storedTemplateId];
        if (mapped) {
          const viaMap = ACTIVE_TEMPLATES.find((t) => t.id === mapped);
          if (viaMap) { resolved = viaMap; resolutionPath = 'stepB-template_id-legacyMap'; }
        }
      }
    }
  }

  // Step C: occasion match (only active templates)
  if (!resolved && posterOccasion) {
    const byOccasion = ACTIVE_TEMPLATES.find((t) => t.occasion_type === posterOccasion);
    if (byOccasion) { resolved = byOccasion; resolutionPath = 'stepC-occasion-match'; }
  }

  // Step D: last-resort fallback with warning (only active templates)
  if (!resolved) {
    resolved = ACTIVE_TEMPLATES[0];
    console.warn('[resolveTemplate stepD-FALLBACK] using first active template posterId=%s layoutTemplateId=%o storedTemplateId=%o occasion=%o',
      poster.id, layoutTemplateId, storedTemplateId, posterOccasion);
    resolutionPath = 'stepD-firstTemplateFallback';
  } else {
    console.log('[resolveTemplate] posterId=%s winner=%s path=%s', poster.id, resolved.id, resolutionPath);
  }

  return resolved;
}

/**
 * Template 1: মহান বিজয় দিবস - Premium with national colors, flag motifs, gold accents
 */
function generateVictoryDayTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const insetPhoto1 = photos[1] || 'https://via.placeholder.com/120x120?text=Support';
  const insetPhoto2 = photos[2] || 'https://via.placeholder.com/120x120?text=Support';
  const insetPhoto3 = photos[3] || 'https://via.placeholder.com/120x120?text=Support';

  const photoUrls = [mainPhoto, insetPhoto1, insetPhoto2, insetPhoto3].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #003d2d 0%, #006a4e 50%, #004d3a 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #ffd700;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 54px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .name {
      position: absolute;
      top: 920px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 66px;
      font-weight: 900;
      color: #ffd700;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1000px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #ffd700;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="footer">প্রচারে: ${escapeHtml(poster.organization || '')}</div>
  </div>
  <script>
    // Preload all images before page is considered ready
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
          img.src = url;
          setTimeout(resolve, 5000); // Timeout after 5 seconds
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Template 2: শোক ও শ্রদ্ধাঞ্জলি - Premium with subdued memorial styling
 */
function generateCondolenceTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #1a2f4a 0%, #1e3a5f 50%, #162e4a 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #d4af37;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 50px;
      font-weight: 900;
      color: #d4af37;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .name {
      position: absolute;
      top: 920px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 66px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1000px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36px;
      font-weight: 700;
      color: #f4e4bc;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #d4af37;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="footer">স্মরণে: ${escapeHtml(poster.organization || '')}</div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Template 3: নির্বাচনী প্রচারণা - Using custom SVG template with dynamic injection
 */
async function generateElectionCampaignTemplate(poster: Poster): Promise<string> {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || '';
  const secondPhoto = photos[1] || '';

  try {
    // Try to fetch SVG from the templates directory with timeout and retry
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const templateUrl = new URL('/templates/election-campaign.svg', baseUrl).href;
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Retry logic for fetching template
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        response = await fetch(templateUrl, { 
          signal: controller.signal,
          headers: {
            'Accept': 'image/svg+xml',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        lastError = new Error(`Template fetch failed with status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        console.warn(`[ELECTION CAMPAIGN TEMPLATE] Fetch attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch election campaign template after 3 attempts: ${lastError?.message}`);
    }
    
    let svgContent = await response.text();

    svgContent = svgContent.replace(
      /<text[^>]*id="headline-text"[^>]*>.*?<\/text>/s,
      `<text id="headline-text" x="600" y="298" text-anchor="middle" fill="#FFF4B5" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="72" font-weight="800">${escapeHtml(poster.headline)}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="name-text"[^>]*>.*?<\/text>/s,
      `<text id="name-text" x="600" y="1018" text-anchor="middle" fill="#FFFFFF" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="76" font-weight="800">${escapeHtml(poster.name)}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="designation-text"[^>]*>.*?<\/text>/s,
      `<text id="designation-text" x="600" y="1115" text-anchor="middle" fill="#F5D878" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="40" font-weight="600">${escapeHtml([poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="district-text"[^>]*>.*?<\/text>/s,
      `<text id="district-text" x="600" y="1248" text-anchor="middle" fill="#FFFFFF" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="36" font-weight="600">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="information-line-1"[^>]*>.*?<\/text>/s,
      `<text id="information-line-1" x="700" y="1415" text-anchor="middle" fill="#FFFFFF" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="29" font-weight="500">${escapeHtml(poster.headline || '')}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="information-line-2"[^>]*>.*?<\/text>/s,
      `<text id="information-line-2" x="700" y="1460" text-anchor="middle" fill="#C9D7D1" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="24">${escapeHtml([poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</text>`
    );

    svgContent = svgContent.replace(
      /<text[^>]*id="footer-text"[^>]*>.*?<\/text>/s,
      `<text id="footer-text" x="600" y="1550" text-anchor="middle" fill="#DDB84A" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="22" font-weight="500" letter-spacing="1">প্রচারে: ${escapeHtml(poster.organization || '')}</text>`
    );

    if (mainPhoto) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-overlay"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-placeholder-body"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<text[^>]*id="photo-placeholder-label"[^>]*>.*?<\/text>/s, '');

      const mainImageElement = `
      <image
        id="photo-main-image"
        href="${escapeHtml(mainPhoto)}"
        x="315"
        y="365"
        width="570"
        height="570"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-main)"
      />`;
      
      svgContent = svgContent.replace(
        /<circle[^>]*id="photo-slot-main"[^>]*\/>/s,
        mainImageElement
      );
    }

    if (secondPhoto) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-head-2"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-placeholder-body-2"[^>]*\/>/s, '');

      const secondImageElement = `
      <image
        id="photo-2-image"
        href="${escapeHtml(secondPhoto)}"
        x="70"
        y="1170"
        width="210"
        height="210"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-2)"
      />`;
      
      svgContent = svgContent.replace(
        /<circle[^>]*id="photo-slot-2"[^>]*\/>/s,
        secondImageElement
      );
    }

    return svgContent;
  } catch (error) {
    console.error('[ELECTION CAMPAIGN TEMPLATE] Error generating template:', error);
    return generateElectionCampaignHTMLFallback(poster);
  }
}

/**
 * Template 4: ঈদ মোবারক - Using custom SVG template with dynamic injection
 */
async function generateEidMubarakTemplate(poster: Poster): Promise<string> {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || '';
  const secondPhoto = photos[1] || '';
  const thirdPhoto = photos[2] || '';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const templateUrl = new URL('/templates/eid-mubarak.svg', baseUrl).href;
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Retry logic for fetching template
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        response = await fetch(templateUrl, { 
          signal: controller.signal,
          headers: {
            'Accept': 'image/svg+xml',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          break;
        }
        
        lastError = new Error(`Template fetch failed with status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        console.warn(`[EID MUBARAK TEMPLATE] Fetch attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch eid mubarak template after 3 attempts: ${lastError?.message}`);
    }
    
    let svgContent = await response.text();

    // Replace headline
    svgContent = svgContent.replace(
      /<text[^>]*id="headline-text"[^>]*>.*?<\/text>/s,
      `<text id="headline-text" x="120" y="635" fill="#07583F" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="78" font-weight="800">${escapeHtml(poster.headline)}</text>`
    );

    // Replace name
    svgContent = svgContent.replace(
      /<text[^>]*id="name-text"[^>]*>.*?<\/text>/s,
      `<text id="name-text" x="90" y="1320" fill="#07583F" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="68" font-weight="800">${escapeHtml(poster.name)}</text>`
    );

    // Replace designation in banner
    svgContent = svgContent.replace(
      /<text[^>]*id="designation-text"[^>]*>.*?<\/text>/s,
      `<text id="designation-text" x="600" y="1535" text-anchor="middle" fill="#FFFFFF" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="45" font-weight="800">${escapeHtml([poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</text>`
    );

    // Replace location badge text
    svgContent = svgContent.replace(
      /<text[^>]*id="location-badge-text"[^>]*>.*?<\/text>/s,
      `<text id="location-badge-text" x="70" y="36" fill="#07583F" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="25" font-weight="600">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</text>`
    );

    // Replace identity text
    svgContent = svgContent.replace(
      /<text[^>]*id="identity-text"[^>]*>.*?<\/text>/s,
      `<text id="identity-text" x="95" y="1385" fill="#52645E" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="27" font-weight="500">${escapeHtml(poster.headline || '')}</text>`
    );

    // Replace greeting line
    svgContent = svgContent.replace(
      /<text[^>]*id="greeting-line-text"[^>]*>.*?<\/text>/s,
      `<text id="greeting-line-text" x="125" y="790" fill="#263B34" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="40" font-weight="500">${escapeHtml('সবাইকে জানাই')}</text>`
    );

    // Replace festive text
    svgContent = svgContent.replace(
      /<text[^>]*id="festive-text"[^>]*>.*?<\/text>/s,
      `<text id="festive-text" x="120" y="885" fill="url(#festive-gradient)" font-family="Hind Siliguri, Noto Sans Bengali, cursive" font-size="78" font-weight="800">${escapeHtml('ঈদের শুভেচ্ছা')}</text>`
    );

    // Main photo injection
    if (mainPhoto) {
      svgContent = svgContent.replace(/<rect[^>]*id="photo-placeholder-main"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-head-main"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-placeholder-body-main"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<ellipse[^>]*id="photo-placeholder-face-highlight"[^>]*\/>/s, '');

      const mainImageElement = `
      <image
        id="photo-main-image"
        href="${escapeHtml(mainPhoto)}"
        x="600"
        y="390"
        width="510"
        height="750"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-main)"
      />`;
      
      svgContent = svgContent.replace(
        /<g[^>]*id="photo-slot-main"[^>]*>.*?<\/g>/s,
        `<g id="photo-slot-main" clip-path="url(#photo-clip-main)">${mainImageElement}</g>`
      );
    }

    // Photo 2 injection
    if (secondPhoto) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-head-2"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-placeholder-body-2"[^>]*\/>/s, '');

      const secondImageElement = `
      <image
        id="photo-2-image"
        href="${escapeHtml(secondPhoto)}"
        x="57"
        y="102"
        width="96"
        height="96"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-2)"
      />`;
      
      svgContent = svgContent.replace(
        /<circle[^>]*id="photo-slot-2"[^>]*\/>/s,
        secondImageElement
      );
    }

    // Photo 3 injection
    if (thirdPhoto) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-placeholder-head-3"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-placeholder-body-3"[^>]*\/>/s, '');

      const thirdImageElement = `
      <image
        id="photo-3-image"
        href="${escapeHtml(thirdPhoto)}"
        x="177"
        y="102"
        width="96"
        height="96"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-3)"
      />`;
      
      svgContent = svgContent.replace(
        /<circle[^>]*id="photo-slot-3"[^>]*\/>/s,
        thirdImageElement
      );
    }

    return svgContent;
  } catch (error) {
    console.error('[EID MUBARAK TEMPLATE] Error generating template:', error);
    return generateEidMubarakHTMLFallback(poster);
  }
}

function generateEidMubarakHTMLFallback(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #FFFDF5 0%, #FFF9E9 50%, #F7EFD7 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 390px;
      left: 850px;
      transform: translateX(-50%);
      width: 500px;
      height: 720px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 635px;
      left: 120px;
      font-size: 78px;
      font-weight: 800;
      color: #07583F;
      font-family: 'Hind Siliguri, Noto Sans Bengali', sans-serif;
    }
    .name {
      position: absolute;
      top: 1320px;
      left: 90px;
      font-size: 68px;
      font-weight: 800;
      color: #07583F;
      font-family: 'Hind Siliguri, Noto Sans Bengali', sans-serif;
    }
    .festive-text {
      position: absolute;
      top: 885px;
      left: 120px;
      font-size: 78px;
      font-weight: 800;
      background: linear-gradient(90deg, #087A55, #F0A52B, #E96A68, #C84E8A);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Hind Siliguri, Noto Sans Bengali', cursive;
    }
    .banner {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 170px;
      background: linear-gradient(90deg, #07563E, #063E2F, #042C22);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .banner-text {
      font-size: 45px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: 'Hind Siliguri, Noto Sans Bengali', sans-serif;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="hero-photo">
      <img src="${mainPhoto}" alt="Main Photo" crossorigin="anonymous" />
    </div>
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="festive-text">ঈদের শুভেচ্ছা</div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="banner">
      <div class="banner-text">${escapeHtml([poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
    </div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>
  `;
}

function generateElectionCampaignHTMLFallback(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #071F18 0%, #0B3024 50%, #260F16 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #DDB84A;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 72px;
      font-weight: 900;
      color: #FFF4B5;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .name {
      position: absolute;
      top: 920px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 76px;
      font-weight: 900;
      color: #FFFFFF;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1000px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 40px;
      font-weight: 700;
      color: #F5D878;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #DDB84A;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml([poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
    <div class="footer">প্রচারে: ${escapeHtml(poster.organization || '')}</div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Template 4: পবিত্র ঈদ মোবারক / রমজান - Premium with Islamic motifs
 */
function generateEidRamadanTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #ffd700;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 50px;
      font-weight: 900;
      color: #ffd700;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .name {
      position: absolute;
      top: 920px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 66px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1000px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36px;
      font-weight: 700;
      color: #ffd700;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #ffd700;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="footer">শুভেচ্ছা: ${escapeHtml(poster.organization || '')}</div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Template 5: শুভেচ্ছা / উৎসব - Premium with festive colors
 */
function generateGreetingTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #fbbf24;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 52px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .name {
      position: absolute;
      top: 920px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 66px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1000px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36px;
      font-weight: 700;
      color: #fbbf24;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #fbbf24;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="footer">শুভেচ্ছা: ${escapeHtml(poster.organization || '')}</div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Generate high-resolution (1200x1600) poster HTML using template-specific HTML/CSS templates.
 */
/**
 * Fallback HTML generator - simple but always works
 */
function generateFallbackHTML(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const photoUrls = [mainPhoto].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-photo {
      position: absolute;
      top: 400px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 8px solid #ffd700;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline {
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 60px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      max-width: 1000px;
    }
    .name {
      position: absolute;
      top: 950px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 70px;
      font-weight: 900;
      color: #ffd700;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .designation {
      position: absolute;
      top: 1050px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 40px;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      font-weight: 600;
      color: #ffd700;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="headline">${escapeHtml(poster.headline)}</div>
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo" crossorigin="anonymous">
    </div>
    <div class="name">${escapeHtml(poster.name)}</div>
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="footer">${escapeHtml(poster.organization || poster.party || '')}</div>
  </div>
  <script>
    (function() {
      const photoUrls = ${JSON.stringify(photoUrls)};
      const imagePromises = photoUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
          setTimeout(resolve, 5000);
        });
      });
      Promise.all(imagePromises).then(() => {
        document.body.classList.add('images-loaded');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Template 6: নতুন নেতৃত্ব — Leadership Poster with 2 photo slots
 */
async function generateLeadershipPosterTemplate(poster: Poster): Promise<string> {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || '';
  const secondPhoto = photos[1] || '';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const templateUrl = new URL('/templates/svg/leadership-poster.svg', baseUrl).href;
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Retry logic for fetching template
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        response = await fetch(templateUrl, { 
          signal: controller.signal,
          headers: {
            'Accept': 'image/svg+xml',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          break;
        }
        
        lastError = new Error(`Template fetch failed with status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        console.warn(`[LEADERSHIP POSTER TEMPLATE] Fetch attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch leadership poster template after 3 attempts: ${lastError?.message}`);
    }
    
    let svgContent = await response.text();

    // Replace headline text (the 3-line headline on the right side)
    if (poster.headline && poster.headline.trim() !== '') {
      // Split headline into 3 parts if possible, otherwise use defaults
      const headlineParts = poster.headline.split(' ');
      const part1 = headlineParts[0] || 'প্রত্যয়';
      const part2 = headlineParts[1] || 'পরিবর্তনে';
      const part3 = headlineParts.slice(2).join(' ') || 'সফল হউক';

      svgContent = svgContent.replace(
        /<text[^>]*id="headline-red"[^>]*>.*?<\/text>/s,
        `<text id="headline-red" x="930" y="1010" text-anchor="middle" fill="url(#headline-red)" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="108" font-weight="900" filter="url(#text-shadow)">${escapeHtml(part1)}</text>`
      );

      svgContent = svgContent.replace(
        /<text[^>]*id="headline-green"[^>]*>.*?<\/text>/s,
        `<text id="headline-green" x="930" y="1100" text-anchor="middle" fill="url(#headline-green)" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="96" font-weight="900" filter="url(#text-shadow)">${escapeHtml(part2)}</text>`
      );

      svgContent = svgContent.replace(
        /<text[^>]*id="headline-black"[^>]*>.*?<\/text>/s,
        `<text id="headline-black" x="930" y="1180" text-anchor="middle" fill="#111111" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="62" font-weight="900">${escapeHtml(part3)}</text>`
      );
    }

    // Replace name
    svgContent = svgContent.replace(
      /<text[^>]*id="name-text"[^>]*>.*?<\/text>/s,
      `<text id="name-text" x="700" y="1418" fill="#ffffff" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="47" font-weight="900">${escapeHtml(poster.name)}</text>`
    );

    // Replace designation/party/organization
    const designationText = [poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || 'পদবী, সংগঠনের নাম';
    svgContent = svgContent.replace(
      /<text[^>]*id="designation-text"[^>]*>.*?<\/text>/s,
      `<text id="designation-text" x="700" y="1467" fill="#ffe86b" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="27" font-weight="600">${escapeHtml(designationText)}</text>`
    );

    // Insert main photo (large path-based slot)
    if (mainPhoto) {
      // Remove all placeholder elements
      svgContent = svgContent.replace(/<rect[^>]*id="main-photo-placeholder"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<ellipse[^>]*id="main-photo-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-photo-neck"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-photo-body"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-photo-shirt"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-photo-tie"[^>]*\/>/s, '');

      const mainImageElement = `
      <image
        id="main-person-image"
        href="${escapeHtml(mainPhoto)}"
        x="20"
        y="790"
        width="645"
        height="835"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-main)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<!--\s*RIGHT INFORMATION/s,
        `${mainImageElement}
    </g>
  </g>


  <!-- =========================================================
       RIGHT INFORMATION`
      );
    }

    // Insert second photo (small circular slot)
    if (secondPhoto) {
      // Remove placeholder elements
      svgContent = svgContent.replace(/<circle[^>]*id="photo-2-placeholder"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<circle[^>]*id="photo-2-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-2-body"[^>]*\/>/s, '');

      const secondImageElement = `
      <image
        id="second-person-image"
        href="${escapeHtml(secondPhoto)}"
        x="103"
        y="83"
        width="144"
        height="144"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-2)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<!--\s*TOP SYMBOL/s,
        `${secondImageElement}
    </g>
  </g>


  <!-- =========================================================
       TOP SYMBOL`
      );
    }

    return svgContent;
  } catch (error) {
    console.error('[LEADERSHIP POSTER TEMPLATE] Error generating template:', error);
    return generateFallbackHTML(poster);
  }
}

/**
 * Template 5: ঈদ মোবারক V2 — Custom SVG with leader photo slots
 */
async function generateEidMubarakV2Template(poster: Poster): Promise<string> {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || '';
  const leaderPhoto1 = photos[1] || '';
  const leaderPhoto2 = photos[2] || '';
  const leaderPhoto3 = photos[3] || '';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const templateUrl = new URL('/templates/svg/eid-mobarak-v2.svg', baseUrl).href;
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Retry logic for fetching template
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        response = await fetch(templateUrl, { 
          signal: controller.signal,
          headers: {
            'Accept': 'image/svg+xml',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          break;
        }
        
        lastError = new Error(`Template fetch failed with status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        console.warn(`[EID MUBARAK V2 TEMPLATE] Fetch attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch eid mubarak v2 template after 3 attempts: ${lastError?.message}`);
    }
    
    let svgContent = await response.text();

    // Replace headline - only if user provided custom headline, otherwise keep default
    if (poster.headline && poster.headline.trim() !== '') {
      svgContent = svgContent.replace(
        /<text[^>]*id="headline-text"[^>]*>.*?<\/text>/s,
        `<text id="headline-text" x="600" y="745" text-anchor="middle" fill="url(#headline-gradient)" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="122" font-weight="900" letter-spacing="1">${escapeHtml(poster.headline)}</text>`
      );
    }

    // Replace message lines (tspans)
    const defaultMessageLine1 = 'ঈদ মোবারক! দেশ ও বিদেশের সকল ধর্মপ্রাণ';
    const defaultMessageLine2 = 'মুসলিম ভাই ও বোনদের জানাই ঈদের শুভেচ্ছা।';
    
    // You can customize message logic here - for now keeping defaults
    svgContent = svgContent.replace(
      /<tspan[^>]*id="message-line-1"[^>]*>.*?<\/tspan>/s,
      `<tspan id="message-line-1" x="600" dy="0">${escapeHtml(defaultMessageLine1)}</tspan>`
    );
    
    svgContent = svgContent.replace(
      /<tspan[^>]*id="message-line-2"[^>]*>.*?<\/tspan>/s,
      `<tspan id="message-line-2" x="600" dy="43">${escapeHtml(defaultMessageLine2)}</tspan>`
    );

    // Replace name
    svgContent = svgContent.replace(
      /<text[^>]*id="name-text"[^>]*>.*?<\/text>/s,
      `<text id="name-text" x="600" y="1430" text-anchor="middle" fill="#ffffff" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="58" font-weight="800">${escapeHtml(poster.name)}</text>`
    );

    // Replace designation/party
    const designationText = [poster.designation, poster.party, poster.organization].filter(Boolean).join(' • ') || 'পদবী, দলের নাম';
    svgContent = svgContent.replace(
      /<text[^>]*id="designation-text"[^>]*>.*?<\/text>/s,
      `<text id="designation-text" x="600" y="1490" text-anchor="middle" fill="#e9e6d8" font-family="Hind Siliguri, Noto Sans Bengali, sans-serif" font-size="28" font-weight="500">${escapeHtml(designationText)}</text>`
    );

    // Insert main person photo
    if (mainPhoto) {
      // Remove placeholder silhouettes
      svgContent = svgContent.replace(/<path[^>]*id="main-silhouette"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<ellipse[^>]*id="main-silhouette-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-silhouette-neck"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="main-silhouette-shoulders"[^>]*\/>/s, '');

      const mainImageElement = `
      <image
        id="main-person-photo"
        href="${escapeHtml(mainPhoto)}"
        x="435"
        y="975"
        width="330"
        height="285"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-main)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<\/g>\s*<!--\s*EDITABLE PHOTO INSERTION GUIDE/s,
        `${mainImageElement}
    </g>
  </g>

  <!-- =========================================================
       EDITABLE PHOTO INSERTION GUIDE`
      );
    }

    // Insert leader photo 1 (top, larger)
    if (leaderPhoto1) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-slot-1-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-slot-1-body"[^>]*\/>/s, '');

      const leader1ImageElement = `
      <image
        id="leader-photo-1"
        href="${escapeHtml(leaderPhoto1)}"
        x="103"
        y="173"
        width="224"
        height="224"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-1)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<!--\s*PHOTO SLOT 2 — SMALL LOWER LEFT/s,
        `${leader1ImageElement}
    </g>
  </g>


  <!-- =====================================================
       PHOTO SLOT 2 — SMALL LOWER LEFT`
      );
    }

    // Insert leader photo 2 (bottom-left, smaller)
    if (leaderPhoto2) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-slot-2-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-slot-2-body"[^>]*\/>/s, '');

      const leader2ImageElement = `
      <image
        id="leader-photo-2"
        href="${escapeHtml(leaderPhoto2)}"
        x="58"
        y="333"
        width="144"
        height="144"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-2)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<!--\s*PHOTO SLOT 3 — SMALL LOWER RIGHT/s,
        `${leader2ImageElement}
    </g>
  </g>


  <!-- =====================================================
       PHOTO SLOT 3 — SMALL LOWER RIGHT`
      );
    }

    // Insert leader photo 3 (bottom-right, smaller)
    if (leaderPhoto3) {
      svgContent = svgContent.replace(/<circle[^>]*id="photo-slot-3-head"[^>]*\/>/s, '');
      svgContent = svgContent.replace(/<path[^>]*id="photo-slot-3-body"[^>]*\/>/s, '');

      const leader3ImageElement = `
      <image
        id="leader-photo-3"
        href="${escapeHtml(leaderPhoto3)}"
        x="220"
        y="333"
        width="144"
        height="144"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photo-clip-3)"
      />`;
      
      svgContent = svgContent.replace(
        /<\/g>\s*<\/g>\s*<!--\s*HEADLINE/s,
        `${leader3ImageElement}
    </g>
  </g>


  <!-- =========================================================
       HEADLINE`
      );
    }

    return svgContent;
  } catch (error) {
    console.error('[EID MUBARAK V2 TEMPLATE] Error generating template:', error);
    return generateFallbackHTML(poster);
  }
}

export async function generatePosterHTML(
  poster: Poster,
  _layout?: LayoutSuggestion,
  template?: Template
): Promise<string> {
  try {
    const resolved = resolveTemplate(poster, template);
    const occasionType = resolved?.occasion_type || poster.occasion;
    const templateId = resolved?.id || '';

    console.log('========================================');
    console.log('[POSTER RENDER] Generating poster for occasion:', occasionType);
    console.log('[POSTER RENDER] Resolved template ID:', resolved?.id);
    console.log('[POSTER RENDER] Poster name:', poster.name);
    console.log('[POSTER RENDER] Poster headline:', poster.headline);
    console.log('[POSTER RENDER] Photo URLs:', poster.photo_urls);
    console.log('========================================');

    // Check for specific template ID first
    if (templateId === 'tpl-eid-mobarak-v2') {
      console.log('[POSTER RENDER] Using Eid Mubarak V2 template (custom SVG with leader photos)');
      return await generateEidMubarakV2Template(poster);
    }

    if (templateId === 'tpl-leadership-poster') {
      console.log('[POSTER RENDER] Using Leadership poster template (custom SVG with 2 photo slots)');
      return await generateLeadershipPosterTemplate(poster);
    }

    switch (occasionType) {
      case 'victory_day':
        console.log('[POSTER RENDER] Using Victory Day template');
        return generateVictoryDayTemplate(poster);
      case 'condolence':
        console.log('[POSTER RENDER] Using Condolence template');
        return generateCondolenceTemplate(poster);
      case 'political_campaign':
        console.log('[POSTER RENDER] Using Election Campaign template (SVG-based)');
        return await generateElectionCampaignTemplate(poster);
      case 'eid_greeting':
        console.log('[POSTER RENDER] Using Eid/Ramadan template');
        return generateEidRamadanTemplate(poster);
      case 'eid_mubarak':
        console.log('[POSTER RENDER] Using Eid Mubarak template (SVG-based)');
        return await generateEidMubarakTemplate(poster);
      case 'greeting':
        console.log('[POSTER RENDER] Using Greeting template');
        return generateGreetingTemplate(poster);
      case 'leadership':
        console.log('[POSTER RENDER] Using Leadership poster template (custom SVG)');
        return await generateLeadershipPosterTemplate(poster);
      case 'tribute':
        console.log('[POSTER RENDER] Using Tribute template (fallback to Greeting)');
        return generateGreetingTemplate(poster);
      default:
        console.warn('[POSTER RENDER] Unknown occasion type:', occasionType, 'falling back to election_campaign');
        return await generateElectionCampaignTemplate(poster);
    }
  } catch (error) {
    console.error('[POSTER RENDER] Error generating poster, using fallback:', error);
    return generateFallbackHTML(poster);
  }
}
