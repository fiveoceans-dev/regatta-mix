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
  return {
    ...client,
    schema,
    from: (table: string) => client.schema(schema).from(table),
    rpc: (fn: string, params?: any, opts?: any) => client.schema(schema).rpc(fn, params, opts),
    channel: (name: string, opts?: any) => client.channel(name, { ...opts, schema })
  } as any;
}

// Example usage:
// const supabase = createSiteClient(SUPABASE_URL, SUPABASE_KEY);
// const { data } = await supabase.from('projects').select('*');
// supabase.channel('updates')
//   .on('postgres_changes', { event: '*', schema: supabase.schema, table: 'projects' }, payload => console.log(payload))
//   .subscribe();
