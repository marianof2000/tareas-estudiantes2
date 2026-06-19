import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseEnv } from './env';

const { supabaseUrl, supabaseKey } = getSupabaseEnv();

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
