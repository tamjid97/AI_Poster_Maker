import type { Template } from '@/types';

export const DEFAULT_TEMPLATES: Template[] = [
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
];