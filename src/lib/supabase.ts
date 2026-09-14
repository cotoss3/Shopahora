import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://acqrrbxqnmpueymgvkpo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcXJyYnhxbm1wdWV5bWd2a3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNjUsImV4cCI6MjEwNDk1MjI2NX0.i2VkQFWf0-1PjgvWetVBfjKcnOBEyPo-UaofPJeib1k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
