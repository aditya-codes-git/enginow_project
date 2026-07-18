import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in the backend environment variables.');
}

let client;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined.');
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.error('[Supabase] Backend client initialization failed at runtime:', err.message);
  
  // Safe mock client stub to prevent backend routing crashes
  client = {
    auth: {
      getUser: async (token) => ({ data: { user: null }, error: err }),
    },
  };
}

export const supabase = client;
export default supabase;
