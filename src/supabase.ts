import { createClient } from '@supabase/supabase-js';
import type { Database } from './dataTypes';

const supabaseUrl = 'https://cmbwtumtfdkybvivxmsx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYnd0dW10ZmRreWJ2aXZ4bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM2NzQsImV4cCI6MjA1NjU0OTY3NH0.TwQNEVL2o9wlCDAJWON7zCXjqgYaT62XsTvn0rTXSX4';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const FILES_BUCKET = 'files';
