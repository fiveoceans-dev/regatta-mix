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

export function createSiteClient(url: string, anonKey: string, host?: string, options?: SupabaseClientOptions<any>): SupabaseClient<Database> & { schema: SiteSchema } {
  const resolvedHost = host ?? (typeof window !== 'undefined' ? window.location.host : '');
  const schema = schemaForHost(resolvedHost);
  
  // Create client with schema-specific configuration
  const client = createClient<Database>(url, anonKey, {
    ...options,
    db: {
      schema: schema,
      ...options?.db
    }
  });
  
  // Override the from method to use the correct schema
  const originalFrom = client.from.bind(client);
  client.from = (table: string) => {
    return originalFrom(`${schema}.${table}`);
  };
  
  return Object.assign(client, { schema });
}

// Example usage:
// const supabase = createSiteClient(SUPABASE_URL, SUPABASE_KEY);
// const { data } = await supabase.from('projects').select('*');
// supabase.channel('updates')
//   .on('postgres_changes', { event: '*', schema: supabase.schema, table: 'projects' }, payload => console.log(payload))
//   .subscribe();
