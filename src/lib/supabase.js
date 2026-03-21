import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Public Client (No Realtime for performance)
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: { persistSession: true },
    global: { headers: { 'x-application-name': 'dvs-ngo-public' } }
  }
);

// Secure Admin Client (Realtime Enabled for dashboards/chat)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: { persistSession: true },
    realtime: { 
      params: { eventsPerSecond: 10 } 
    },
    global: { headers: { 'x-application-name': 'dvs-ngo-admin' } }
  }
);
