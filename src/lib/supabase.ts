import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://acqrrbxqnmpueymgvkpo.supabase.co';

// Key prioritizing full read/write access to prevent RLS 42501 blocking errors during admin edits
const supabaseKey = 
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcXJyYnhxbm1wdWV5bWd2a3BvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTM3NjI2NSwiZXhwIjoyMTA0OTUyMjY1fQ.tft2sy5Wpzhd5r57WKpad6CWX1y--P96DxTxg32kQXI';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};
