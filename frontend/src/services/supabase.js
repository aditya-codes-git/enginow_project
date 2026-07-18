import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined in the frontend environment variables.');
}

let client;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined.');
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.error('[Supabase] Client initialization failed at runtime:', err);
  
  // Safe mock client stub to prevent import crashes and white screens
  client = {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null }, error: err }),
      signInWithPassword: async () => ({ data: { session: null }, error: err }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({ data: {}, error: err }),
    },
  };
}

export const supabase = client;
export default supabase;
