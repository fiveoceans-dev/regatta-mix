import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from './types';

export type SiteSchema = 'site_regatta' | 'site_web3analytics' | 'site_openair' | 'site_allyou' | 'site_buena' | 'site_morph';

const HOST_MAP: Record<string, SiteSchema> = {
  'regatta-rift.lovable.app': 'site_regatta',
  'web3analytics.lovable.app': 'site_web3analytics',
  'openair.lovable.app': 'site_openair',
  'allyoucompany.com': 'site_allyou',
  'buena': 'site_buena',
  'morph.': 'site_morph'
};

const DEFAULT_SCHEMA: SiteSchema = 'site_regatta';

export function schemaForHost(host: string): SiteSchema {
  const schema = HOST_MAP[host];
  if (schema) return schema;
  if (!host) return DEFAULT_SCHEMA;
  throw new Error(`Unknown host: ${host}`);
}

export function createSiteClient(url: string, anonKey: string, host?: string, options?: SupabaseClientOptions<any>) {
  const resolvedHost = host ?? (typeof window !== 'undefined' ? window.location.host : '');
  const schema = schemaForHost(resolvedHost);
  
  // Create standard client
  const client = createClient<Database>(url, anonKey, options);
  
  // Create schema-aware wrapper
  const siteClient = {
    ...client,
    schema,
    // Override from method to use schema-prefixed table names
    from: (table: string) => {
      return client.from(`${schema}.${table}` as any);
    },
    // Keep original client methods for public schema access
    publicFrom: (table: keyof Database['public']['Tables']) => {
      return client.from(table);
    }
  };
  
  return siteClient;
}

// Example usage:
// const supabase = createSiteClient(SUPABASE_URL, SUPABASE_KEY);
// const { data } = await supabase.from('regattas').select('*'); // automatically uses site_regatta.regattas
// supabase.channel('updates')
//   .on('postgres_changes', { event: '*', schema: supabase.schema, table: 'regattas' }, payload => console.log(payload))
//   .subscribe();
