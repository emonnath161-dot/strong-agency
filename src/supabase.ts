import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gogguoutyigaczrvcbpp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZ2d1b3V0eWlnYWN6cnZjYnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzA2NjAsImV4cCI6MjA5MDQ0NjY2MH0.RhHZrTC0U6r4sHjMr6SbFov9BOJXQ_VK0QmFTsRj7Ac';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
