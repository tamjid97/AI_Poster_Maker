import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LayoutSuggestion, Template, Poster } from '@/types';

const geminiApiKey = process.env.GEMINI_API_KEY || '';

export async function getLayoutSuggestion(params: {
  occasion: string;
  headline: string;
  name: string;
  designation?: string;
  party?: string;
  organization?: string;
  unionOrThana?: string;
  district?: string;
  photoCount: number;
  template?: Template | null;
}): Promise<LayoutSuggestion> {
  if (!geminiApiKey) {
    return getDefaultLayoutSuggestion(params);
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional poster design assistant. Analyze the following poster information and suggest a layout arrangement as structured JSON.

Poster Information:
- Occasion: ${params.occasion}
- Headline: ${params.headline}
- Person Name: ${params.name}
- Designation: ${params.designation || 'N/A'}
- Party: ${params.party || 'N/A'}
- Organization: ${params.organization || 'N/A'}
- Union/Thana: ${params.unionOrThana || 'N/A'}
- District: ${params.district || 'N/A'}
- Number of Photos: ${params.photoCount}
- Template: ${params.template?.title || 'Custom'}

Respond ONLY with a JSON object (no markdown, no code blocks) with this exact structure:
{
  "layout": "description of overall layout arrangement",
  "colorPalette": {
    "primary": "hex color",
    "secondary": "hex color",
    "accent": "hex color",
    "background": "hex color",
    "text": "hex color"
  },
  "photoPlacement": "description of how photos should be arranged",
  "typography": {
    "headline": "font style suggestion",
    "body": "font style suggestion",
    "hierarchy": "typography hierarchy description"
  },
  "decorativeElements": ["list of decorative elements"],
  "visualStyle": "overall visual style description",
  "composition": "composition description",
  "backgroundDecoration": "background decoration suggestion"
}

Consider the occasion type carefully. For condolence posters use somber dark colors. For Eid use green and gold. For Victory Day use red and green (Bangladesh flag colors). For political campaigns use bold professional colors.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return parsed as LayoutSuggestion;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getDefaultLayoutSuggestion(params);
  }
}

export function getDefaultLayoutSuggestion(params: {
  occasion: string;
  template?: Template | null;
}): LayoutSuggestion {
  const config = params.template?.layout_config;
  if (config) {
    const primaryColor = config.primaryColor || '#006a4e';
    const secondaryColor = config.secondaryColor || '#f42a41';
    const accentColor = config.accentColor || '#ffd700';
    const textColor = config.textColor || '#ffffff';

    return {
      layout: 'Classic centered layout with photo grid at top and text below',
      colorPalette: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: config.bgStyle === 'gradient' ? (config.bgFrom || primaryColor) : (config.bgColor || '#1a1a1a'),
        text: textColor,
      },
      photoPlacement: config.photoLayout || 'grid',
      typography: {
        headline: 'Bold, large, centered',
        body: 'Regular, readable size',
        hierarchy: 'Headline > Name > Designation > Other details',
      },
      decorativeElements: config.decorativeElements || [],
      visualStyle: 'Professional political poster',
      composition: 'Top-to-bottom reading flow',
      backgroundDecoration: config.bgStyle === 'gradient' ? 'Gradient background' : 'Solid background',
    };
  }

  const occasionColors: Record<string, { primary: string; secondary: string; accent: string; bg: string }> = {
    condolence: { primary: '#2d2d2d', secondary: '#555555', accent: '#888888', bg: '#0a0a0a' },
    eid_greeting: { primary: '#0d7530', secondary: '#c9a227', accent: '#f5e6a8', bg: '#094a1e' },
    victory_day: { primary: '#006a4e', secondary: '#f42a41', accent: '#ffd700', bg: '#003d2d' },
    political_campaign: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#fbbf24', bg: '#0f172a' },
  };

  const colors = occasionColors[params.occasion] || occasionColors.political_campaign;

  return {
    layout: 'Classic centered layout with photos at top and text below',
    colorPalette: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.bg,
      text: '#ffffff',
    },
    photoPlacement: 'grid',
    typography: {
      headline: 'Bold, large, centered',
      body: 'Regular, readable size',
      hierarchy: 'Headline > Name > Designation > Other details',
    },
    decorativeElements: [],
    visualStyle: 'Professional political poster',
    composition: 'Top-to-bottom reading flow',
    backgroundDecoration: 'Gradient background',
  };
}
