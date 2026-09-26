import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// OFFLINE MODE: If no Supabase credentials, create a mock client
const isOfflineMode = !supabaseUrl || !supabaseAnonKey;

if (isOfflineMode) {
  console.warn('[OFFLINE MODE] Running without Supabase. All features will work locally.');
}

// In-memory store for offline mode. Keyed by table name → array of rows.
// Using a file-level module symbol so both client and server invocations share state
// within the same Next.js process.
const offlineStore: Record<string, any[]> = {
  posters: [],
  templates: [],
  profiles: [],
  users: [],
};

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function applyEq<T extends Record<string, any>>(rows: T[], filters: Record<string, any>): T[] {
  return rows.filter((row) =>
    Object.entries(filters).every(([k, v]) => row[k] === v)
  );
}

// Mock Supabase client for offline mode
const createMockClient = (): any => {
  const client: any = {
    auth: {
      getUser: async () => ({
        data: { user: { id: 'offline-user', email: 'offline@test.com', name: 'Offline User' } },
        error: null,
      }),
      signUp: async (payload: { email: string; password: string; options?: { data?: { name?: string } } }) => ({
        data: {
          user: {
            id: uuidv4(),
            email: payload.email,
            name: payload.options?.data?.name || payload.email.split('@')[0],
          },
          session: { access_token: 'offline-token-' + Date.now() },
        },
        error: null,
      }),
      signInWithPassword: async (payload: { email: string; password: string }) => ({
        data: {
          user: { id: 'offline-user', email: payload.email, name: payload.email.split('@')[0] },
          session: { access_token: 'offline-token' },
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({
        data: { session: { access_token: 'offline-token', user: { id: 'offline-user', email: 'offline@test.com', name: 'Offline User' } } },
        error: null,
      }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => {
      if (!offlineStore[table]) offlineStore[table] = [];

      const buildSelectChain = (baseRowsGetter: () => any[], selectCount?: boolean) => {
        const eqFilters: Record<string, any> = {};
        let orderField: string | null = null;
        let orderAscending = true;
        let rangeStart = 0;
        let rangeEnd = Infinity;
        let headOnly = false;
        let exactCountRequested: string | null = null;

        const runQuery = () => {
          let rows = baseRowsGetter();
          rows = applyEq(rows, eqFilters);
          if (orderField) {
            rows = [...rows].sort((a: any, b: any) => {
              const av = a[orderField!];
              const bv = b[orderField!];
              if (av == null && bv == null) return 0;
              if (av == null) return orderAscending ? 1 : -1;
              if (bv == null) return orderAscending ? -1 : 1;
              if (av < bv) return orderAscending ? -1 : 1;
              if (av > bv) return orderAscending ? 1 : -1;
              return 0;
            });
          }
          const total = rows.length;
          if (!isFinite(rangeEnd)) rangeEnd = rows.length;
          rows = rows.slice(rangeStart, isFinite(rangeEnd) ? rangeEnd + 1 : rows.length);
          return { rows, total };
        };

        const chain: any = {
          select: (selectArg?: any) => {
            if (typeof selectArg === 'object' && selectArg && (selectArg as any).count) {
              exactCountRequested = (selectArg as any).count;
            }
            return chain;
          },
          eq: (field: string, value: any) => {
            eqFilters[field] = value;
            return chain;
          },
          maybeSingle: async () => {
            const { rows } = runQuery();
            if (rows.length === 0) return { data: null, error: null };
            return { data: rows[0], error: null };
          },
          single: async () => {
            const { rows } = runQuery();
            if (rows.length === 0) return { data: null, error: { message: 'No rows found', code: 'PGRST116' } };
            return { data: rows[0], error: null };
          },
          order: (field: string, opts?: { ascending?: boolean }) => {
            orderField = field;
            orderAscending = opts?.ascending !== false;
            return chain;
          },
          range: (start: number, end: number) => {
            rangeStart = start;
            rangeEnd = end;
            return chain;
          },
          then: async (resolver: any) => {
            const { rows, total } = runQuery();
            let count: number | null = null;
            if (exactCountRequested === 'exact') count = total;
            if (headOnly) {
              return resolver({ data: null, count, error: null });
            }
            return resolver({ data: rows, count, error: null });
          },
        };
        return chain;
      };

      return {
        select: (arg?: any) => {
          // Support both `.select('*')` and `.select('*', { count: 'exact', head: true })`
          const headOnly = !!(typeof arg === 'object' && arg && (arg as any).head);
          const chain = buildSelectChain(() => offlineStore[table]);
          if (typeof arg === 'object' && arg && (arg as any).count) {
            // @ts-ignore
            chain.select(arg);
          }
          if (headOnly) {
            // @ts-ignore
            chain.select = () => chain;
            // Force head-only semantics by injecting an empty data result in then
            const originalThen = chain.then.bind(chain);
            chain.then = async (resolver: any) => {
              const { total } = (buildSelectChain(() => offlineStore[table]) as any).runQuery ? (buildSelectChain(() => offlineStore[table]) as any).runQuery() : { total: offlineStore[table].length };
              return resolver({ data: null, count: offlineStore[table].length, error: null });
            };
          }
          return chain;
        },
        insert: (rowsOrRow: any | any[]) => {
          const rows = Array.isArray(rowsOrRow) ? rowsOrRow : [rowsOrRow];
          const insertedIds: string[] = [];
          for (const row of rows) {
            const newRow: any = { ...row };
            if (!newRow.id) {
              // Prefer temp-style IDs only when offline so that our temp-poster localStorage path works
              if (table === 'posters') {
                newRow.id = 'temp-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
              } else {
                newRow.id = uuidv4();
              }
            }
            // Always attach default timestamps if the server/DB would have
            if (table === 'posters') {
              if (!newRow.created_at) newRow.created_at = new Date().toISOString();
              if (!newRow.updated_at) newRow.updated_at = new Date().toISOString();
              if (newRow.status == null) newRow.status = 'DRAFT';
              if (newRow.regenerate_count == null) newRow.regenerate_count = 0;
              if (!newRow.photo_urls) newRow.photo_urls = [];
            }
            offlineStore[table].push(newRow);
            insertedIds.push(newRow.id);
          }
          const selectChain = buildSelectChain(() => {
            return offlineStore[table].filter((r: any) => insertedIds.includes(r.id));
          });
          // Override maybeSingle/single so they return the inserted row even without explicit eq
          return {
            select: () => {
              return {
                single: async () => {
                  const inserted = offlineStore[table].find((r: any) => r.id === insertedIds[0]) || null;
                  return { data: inserted, error: inserted ? null : { message: 'Insert row not found' } };
                },
              };
            },
          };
        },
        update: (patch: Record<string, any>) => {
          const eqFilters: Record<string, any> = {};
          return {
            eq: (field: string, value: any) => {
              eqFilters[field] = value;
              const buildUpdateSelect = () => {
                const affectedIds: string[] = [];
                offlineStore[table] = offlineStore[table].map((row: any) => {
                  if (Object.entries(eqFilters).every(([k, v]) => row[k] === v)) {
                    const updated: any = { ...row, ...patch, updated_at: new Date().toISOString() };
                    affectedIds.push(updated.id);
                    return updated;
                  }
                  return row;
                });
                return { affectedIds };
              };
              return {
                select: () => ({
                  single: async () => {
                    const { affectedIds } = buildUpdateSelect();
                    if (affectedIds.length === 0) {
                      return { data: null, error: { message: 'No rows updated' } };
                    }
                    const row = offlineStore[table].find((r: any) => r.id === affectedIds[0]) || null;
                    return { data: row, error: null };
                  },
                }),
                eq: (f: string, v: any) => {
                  eqFilters[f] = v;
                  return buildUpdateSelect();
                },
              };
            },
          };
        },
        delete: () => ({
          eq: async (field: string, value: any) => {
            const before = offlineStore[table].length;
            offlineStore[table] = offlineStore[table].filter((row: any) => row[field] !== value);
            const after = offlineStore[table].length;
            if (before === after) {
              return { error: { message: 'No rows matched delete filter' } };
            }
            return { error: null };
          },
        }),
      };
    },
  };
  return client;
};

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
