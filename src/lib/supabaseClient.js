import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkmyssnpsswglepawngc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODQ1MDYsImV4cCI6MjA5MjM2MDUwNn0.fUYK0Zu9dLM5oLw0SqwEY_AbCsPjYd_LLjSzaqVgR6U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
