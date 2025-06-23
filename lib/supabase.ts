import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ghitsjggoqyzmouzhtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXRzamdnb3F5em1vdW96aHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzI0NjUsImV4cCI6MjA2NDc0ODQ2NX0.cXpf2vTIx1w5LETwRp1uQyDZ7K7InKQvpYGr3ufsMGQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});