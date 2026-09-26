import type { Template } from '@/types';

export const DEFAULT_TEMPLATES: Template[] = [
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
];