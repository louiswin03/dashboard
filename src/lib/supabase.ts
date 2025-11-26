import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ullhtlubvkikkmilmpjc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbGh0bHVidmtpa2ttaWxtcGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDc1ODUsImV4cCI6MjA3OTcyMzU4NX0.zImQGtaWN99hiV193a6lL-q37mX0uf8m2i97W3Ex23s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
