export type UserRole = 'USER' | 'ADMIN';

export type PosterStatus = 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export type OccasionType =
  | 'political_campaign'
  | 'condolence'
  | 'eid_greeting'
  | 'eid_mubarak'
  | 'greeting'
  | 'victory_day'
  | 'leadership'
  | 'tribute';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  occasion_type: string;
  thumbnail_url: string;
  layout_config: TemplateLayoutConfig;
  is_active: boolean;
  created_at: string;
}

export interface TemplateLayoutConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bgStyle?: string;
  bgFrom?: string;
  bgTo?: string;
  bgColor?: string;
  font?: string;
  headerStyle?: string;
  photoLayout?: string;
  decorativeElements?: string[];
  textColor?: string;
  svgPath?: string;
  [key: string]: unknown;
}

export interface Poster {
  id: string;
  user_id: string;
  template_id: string | null;
  name: string;
  designation: string | null;
  party: string | null;
  organization: string | null;
  union_or_thana: string | null;
  district: string | null;
  occasion: string;
  headline: string;
  photo_urls: string[];
  generated_image_url: string | null;
  layout_suggestion: LayoutSuggestion | null;
  status: PosterStatus;
  regenerate_count: number;
  created_at: string;
}

export interface LayoutSuggestion {
  layout: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  photoPlacement: string;
  typography: {
    headline: string;
    body: string;
    hierarchy: string;
  };
  decorativeElements: string[];
  visualStyle: string;
  composition: string;
  backgroundDecoration: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export const OCCASION_LABELS: Record<string, string> = {
  political_campaign: 'Political Worker / Campaign',
  condolence: 'Condolence / Mourning',
  eid_greeting: 'Eid / Greeting',
  eid_mubarak: 'Eid Mubarak',
  greeting: 'Greeting / Celebration',
  victory_day: 'Victory Day',
  leadership: 'Leadership / Change',
  tribute: 'Tribute / Special Occasion',
};

export const OCCASION_OPTIONS = Object.entries(OCCASION_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const STATUS_LABELS: Record<PosterStatus, string> = {
  DRAFT: 'Draft',
  GENERATING: 'Generating',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const MAX_REGENERATE_COUNT = 3;
export const MAX_PHOTOS = 4;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
