import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from './types';

export type SiteSchema = 'site_cyber' | 'site1' | 'site2';

const HOST_MAP: Record<string, SiteSchema> = {
  'cyber.sailing': 'site_cyber',
  'site1.example': 'site1',
  'site2.example': 'site2'
};

const DEFAULT_SCHEMA: SiteSchema = 'site_cyber';

export function schemaForHost(host: string): SiteSchema {
  const schema = HOST_MAP[host];
  if (schema) return schema;
  if (!host) return DEFAULT_SCHEMA;
  throw new Error(`Unknown host: ${host}`);
}

export function createSiteClient(url: string, anonKey: string, host?: string, options?: SupabaseClientOptions<any>): SupabaseClient<Database> & { schema: SiteSchema } {
  const resolvedHost = host ?? (typeof window !== 'undefined' ? window.location.host : '');
  const schema = schemaForHost(resolvedHost);
  const client = createClient<Database>(url, anonKey, options);
  
  // Return base client with schema info until migrations are run
  return Object.assign(client, { schema });
}

// Example usage:
// const supabase = createSiteClient(SUPABASE_URL, SUPABASE_KEY);
// const { data } = await supabase.from('projects').select('*');
// supabase.channel('updates')
//   .on('postgres_changes', { event: '*', schema: supabase.schema, table: 'projects' }, payload => console.log(payload))
//   .subscribe();
