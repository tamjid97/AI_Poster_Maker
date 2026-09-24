import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// OFFLINE MODE: If no Supabase credentials, create a mock client
const isOfflineMode = !supabaseUrl || !supabaseAnonKey;

if (isOfflineMode) {
  console.warn('[OFFLINE MODE] Running without Supabase. All features will work locally.');
}

// Mock Supabase client for offline mode
const createMockClient = (): any => ({
  auth: {
    getUser: async () => ({ data: { user: { id: 'offline-user', email: 'offline@test.com' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'offline-user', email: 'offline@test.com' }, session: { access_token: 'offline-token' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: { access_token: 'offline-token' } }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null, error: null }),
        single: async () => ({ data: null, error: null }),
      }),
      order: () => ({
        range: async () => ({ data: [], error: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: { id: 'temp-' + Date.now() }, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: async () => ({ error: null }),
    }),
  }),
});

export const supabase: any = isOfflineMode ? createMockClient() : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function createServerSupabaseClient(token?: string): any {
  if (isOfflineMode) {
    return createMockClient();
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}

let _adminClient: any = null;

export function getSupabaseAdmin(): any {
  if (isOfflineMode) {
    return createMockClient();
  }
  if (!_adminClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!serviceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
    }
    _adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _adminClient;
}
