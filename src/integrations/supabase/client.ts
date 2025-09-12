import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://amhlmmzmbjcxzpynnirx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGxtbXptYmpjeHpweW5uaXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjEwNzMsImV4cCI6MjA3MDI5NzA3M30.lQ3epSFa-LNWHZ-92HcQbknG4KvsuJXu3oJKJlVLrg8";

// Use cookies for auth persistence
const cookieStorage = {
  getItem: (key: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  },
  setItem: (key: string, value: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; secure; samesite=strict`;
  },
  removeItem: (key: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

// Create standard client
const baseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Get current schema based on host
function getCurrentSchema(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host === 'regatta-rift.lovable.app') return 'site_regatta';
    if (host === 'web3analytics.lovable.app') return 'site_web3analytics';
    if (host === 'openair.lovable.app') return 'site_openair';
    if (host === 'allyoucompany.com') return 'site_allyou';
    if (host === 'buena') return 'site_buena';
    if (host === 'morph.') return 'site_morph';
  }
  return 'site_regatta'; // default
}

// Export client with schema-aware methods
export const supabase = {
  // Standard client methods for public schema
  from: (table: keyof Database['public']['Tables']) => baseClient.from(table),
  
  // Schema-specific methods (use raw SQL for schema-prefixed queries)
  site: {
    regattas: () => baseClient.from(`${getCurrentSchema()}.regattas` as any),
    regatta_registrations: () => baseClient.from(`${getCurrentSchema()}.regatta_registrations` as any),
    achievements: () => baseClient.from(`${getCurrentSchema()}.achievements` as any),
    boats: () => baseClient.from(`${getCurrentSchema()}.boats` as any),
    parts: () => baseClient.from(`${getCurrentSchema()}.parts` as any),
    crew: () => baseClient.from(`${getCurrentSchema()}.crew` as any),
    races: () => baseClient.from(`${getCurrentSchema()}.races` as any),
    race_results: () => baseClient.from(`${getCurrentSchema()}.race_results` as any),
    protests: () => baseClient.from(`${getCurrentSchema()}.protests` as any),
    transactions: () => baseClient.from(`${getCurrentSchema()}.transactions` as any),
    user_settings: () => baseClient.from(`${getCurrentSchema()}.user_settings` as any),
  },
  
  // Auth and storage
  auth: baseClient.auth,
  storage: baseClient.storage,
  rpc: baseClient.rpc.bind(baseClient)
};