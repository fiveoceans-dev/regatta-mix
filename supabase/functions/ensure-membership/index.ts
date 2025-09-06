import { createClient } from '@supabase/supabase-js';

export default async function handler(req: Request) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supabase.rpc('ensure_membership_for_domain');
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return new Response('ok');
}
