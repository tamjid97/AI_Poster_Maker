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
    is_active: false, // Disabled - blank thumbnail due to minimal design
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
    is_active: false, // Disabled - duplicate of tpl-eid-mobarak-v2 with same thumbnail
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